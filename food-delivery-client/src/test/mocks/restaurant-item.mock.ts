import { RestaurantItemI } from 'src/app/shared/models/restaurant-item/restaurant-item.interface';
import { restaurantMock } from './restaurant.mock';

export const restaurantItem1Mock = {
  id: 1,
  name: 'Test Restaurant Item',
  description: 'Test Restaurant Item Description',
  restaurant: restaurantMock,
  price: 1.99,
  image: 'image',
} as RestaurantItemI;
export const restaurantItem2Mock = {
  id: 2,
  name: 'Test Restaurant Item 2',
  description: 'Test Restaurant Item 2 Description',
  restaurant: restaurantMock,
  price: 2.99,
  image: 'image',
} as RestaurantItemI;
