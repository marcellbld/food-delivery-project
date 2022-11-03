import { AutoMap } from '@automapper/classes';
import { CartDto } from '../../cart/dto/cart.dto';

export class OrderDto {
  @AutoMap()
  id!: number;
  @AutoMap()
  commission!: number;
  @AutoMap()
  cart!: CartDto;
  @AutoMap()
  createdAt!: Date;
  @AutoMap()
  deliveryTime!: Date;
}
