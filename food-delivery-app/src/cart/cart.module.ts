import { Module } from '@nestjs/common';
import { CartsService } from './services/cart/carts.service';
import { CartController } from './controllers/cart/cart.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cart } from './entities/cart.model';
import { CartItem } from './entities/cart-item.model';
import { CartItemsService } from './services/cart-item/cart-items.service';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Cart, CartItem],
    }),
    RestaurantsModule,
  ],
  providers: [CartsService, CartItemsService],
  controllers: [CartController],
  exports: [CartsService],
})
export class CartModule {}
