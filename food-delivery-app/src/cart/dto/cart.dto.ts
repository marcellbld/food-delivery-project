import { AutoMap } from '@automapper/classes';
import { RestaurantDto } from '../../restaurants/dto/restaurant/restaurant.dto';
import { UserDto } from '../../users/dto/user.dto';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
  @AutoMap()
  id!: number;
  @AutoMap()
  purchased!: boolean;
  @AutoMap()
  purchasedDate?: Date;
  @AutoMap()
  restaurant!: RestaurantDto;
  @AutoMap()
  cartItems!: CartItemDto[];
  @AutoMap()
  user!: UserDto;
}
