import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Order } from './entities/order.model';
import { OrdersController } from './controllers/orders/orders.controller';
import { OrdersService } from './services/orders/orders.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Order],
    }),
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
