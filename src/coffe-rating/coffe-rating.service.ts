import { Injectable } from '@nestjs/common';
import { CoffesService } from 'src/coffes/coffes.service';

@Injectable()
export class CoffeRatingService {
  constructor(private readonly coffesService: CoffesService) {}
}
