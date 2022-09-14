import { RestaurantI } from '../restaurant/restaurant.interface';
import { UserI } from '../user/user.interface';
import { CartItemI } from './cart-item.interface';

export interface CartI {
  id: number;
  purchased: boolean;
  purchasedDate: Date;
  restaurant: RestaurantI;
  cartItems: CartItemI[];
  user: UserI;

  findItem(restaurantItemId: number): CartItemI | undefined;
}
