import { RestaurantItemI } from '../restaurant-item/restaurant-item.interface';

export interface CartItemI {
  id: number;
  count: number;
  price: number;
  item: RestaurantItemI;
}
