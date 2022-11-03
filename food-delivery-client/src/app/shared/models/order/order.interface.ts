import { CartI } from '../cart/cart.interface';
import { UserI } from '../user/user.interface';

export interface OrderI {
  id?: number;
  commission?: number;
  completed?: boolean;
  cart?: CartI;
  deliveryTime?: Date;
  createdAt?: Date;
}
