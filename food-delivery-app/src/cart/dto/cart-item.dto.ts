import { AutoMap } from '@automapper/classes';
import { RestaurantItemDto } from '../../restaurants/dto/restaurant-item/restaurant-item.dto';

export class CartItemDto {
  @AutoMap()
  id!: number;

  @AutoMap()
  count!: number;

  @AutoMap()
  price!: number;

  @AutoMap()
  item!: RestaurantItemDto;
}
