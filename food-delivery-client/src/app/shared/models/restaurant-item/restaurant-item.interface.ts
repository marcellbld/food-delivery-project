import { RestaurantI } from '../restaurant/restaurant.interface';

export interface RestaurantItemI {
  id: number;
  name: string;
  description: string;
  restaurant: RestaurantI;
  price: number;
  image: string;
}
