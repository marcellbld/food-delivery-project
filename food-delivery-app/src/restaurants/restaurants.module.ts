import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from '../categories/entities/category.model';
import { RestaurantsController } from './controllers/restaurants/restaurants.controller';
import { RestaurantItem } from './entities/restaurant-item.model';
import { Restaurant } from './entities/restaurant.model';
import { RestaurantItemsService } from './services/restaurant-items/restaurant-items.service';
import { RestaurantsService } from './services/restaurants/restaurants.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Restaurant, RestaurantItem, Category],
    }),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantItemsService],
  exports: [RestaurantsService, RestaurantItemsService],
})
export class RestaurantsModule {}
