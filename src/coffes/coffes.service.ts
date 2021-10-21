import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { Coffe } from './entities/coffe.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffesService {
  constructor(
    @InjectRepository(Coffe)
    private readonly coffeRepository: Repository<Coffe>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const coffe = await this.coffeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffe) {
      throw new NotFoundException(`Coffe #${id} not found`);
    }
    return coffe;
  }

  async create(createCoffeeDto: CreateCoffeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffe = this.coffeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeRepository.save(coffe);
  }
  async update(id: string, updateCoffeDto: UpdateCoffeDto) {
    const flavors =
      updateCoffeDto.flavors &&
      (await Promise.all(
        updateCoffeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffe = await this.coffeRepository.preload({
      id: +id,
      ...updateCoffeDto,
      flavors,
    });
    if (!coffe) {
      throw new NotFoundException(`Coffe #${id} not found`);
    }
    return this.coffeRepository.save(coffe);
  }

  async remove(id: string) {
    const coffe = await this.findOne(id);
    return this.coffeRepository.remove(coffe);
  }

  async recommendCoffee(coffee: Coffe) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
