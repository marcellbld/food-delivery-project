import { CartItemI } from 'src/app/shared/models/cart/cart-item.interface';
import {
  restaurantItem1Mock,
  restaurantItem2Mock,
} from './restaurant-item.mock';

export const cartItemMock = {
  id: 1,
  count: 2,
  price: 1.1,
  item: restaurantItem1Mock,
} as CartItemI;
export const cartItem2Mock = {
  id: 1,
  count: 3,
  price: 1.2,
  item: restaurantItem2Mock,
} as CartItemI;
