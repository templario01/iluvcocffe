import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1634787563490 implements MigrationInterface {
  name = 'SchemaSync1634787563490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffe" RENAME COLUMN "descriptions" TO "description"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffe" RENAME COLUMN "description" TO "descriptions"`,
    );
  }
}
