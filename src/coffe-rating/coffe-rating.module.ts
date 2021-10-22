import { Module } from '@nestjs/common';
import { CoffesModule } from 'src/coffes/coffes.module';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeRatingService } from './coffe-rating.service';

@Module({
  imports: [
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      password: 'password',
      port: 5432,
    }),
    CoffesModule,
  ],
  providers: [CoffeRatingService],
})
export class CoffeRatingModule {}
