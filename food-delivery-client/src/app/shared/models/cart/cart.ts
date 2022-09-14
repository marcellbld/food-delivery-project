import { RestaurantI } from '../restaurant/restaurant.interface';
import { UserI } from '../user/user.interface';
import { CartItemI } from './cart-item.interface';
import { CartI } from './cart.interface';

export class Cart implements CartI {
  id!: number;
  purchased!: boolean;
  purchasedDate!: Date;
  restaurant!: RestaurantI;
  cartItems!: CartItemI[];
  user!: UserI;
  constructor() {}

  findItem(restaurantItemId: number): CartItemI | undefined {
    return this.cartItems.find((cItem) => cItem.item.id === restaurantItemId);
  }

  updateOrAddItem(cartItem: CartItemI): void {
    const id = this.cartItems.findIndex((item) => item.id === cartItem.id);
    if (id === -1) {
      this.cartItems.push(cartItem);
    } else {
      this.cartItems[id] = cartItem;
    }
  }

  deleteItem(id: number): void {
    const foundId = this.cartItems.findIndex((item) => item.id === id);
    this.cartItems.splice(foundId, 1);
  }

  calculateTotalCost(): number {
    return this.cartItems.reduce((prev, curr) => prev + curr.price, 0);
  }
}
