import { Cart } from 'src/app/shared/models/cart/cart';
import { cartItem2Mock, cartItemMock } from './cart-item.mock';
import { restaurantMock } from './restaurant.mock';
import { userMock } from './user.mock';

export const cartMock = {
  id: 1,
  purchased: false,
  order: undefined,
  restaurant: restaurantMock,
  cartItems: [cartItemMock, cartItem2Mock],
  user: userMock,
};
export const purchasedCartMock = {
  id: 2,
  purchased: true,
  purchasedDate: new Date(999999999),
  order: undefined,
  restaurant: restaurantMock,
  cartItems: [cartItemMock, cartItem2Mock],
  user: userMock,
  calculateTotalCost: jest.fn(),
  findItem: jest.fn(),
  updateOrAddItem: jest.fn(),
  deleteItem: jest.fn(),
} as Cart;
export const purchasedCart2Mock = {
  id: 3,
  purchased: true,
  purchasedDate: new Date(999999999),
  order: undefined,
  restaurant: restaurantMock,
  cartItems: [cartItemMock, cartItem2Mock],
  user: userMock,
  calculateTotalCost: jest.fn(),
  findItem: jest.fn(),
  updateOrAddItem: jest.fn(),
  deleteItem: jest.fn(),
} as Cart;
