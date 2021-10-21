import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1634785898768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffe" RENAME COLUMN "name" TO "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffe" RENAME COLUMN "title" TO "name"`,
    );
  }
}
