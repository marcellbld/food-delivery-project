import * as CartMocks from './cart.mock';
import * as RestaurantItemMocks from './restaurant-item.mock';

export const cartItemMock = () => ({
  id: 1,
  count: 2,
  cart: CartMocks.cartMock(),
  item: RestaurantItemMocks.restaurantItemMock(),
});

export const cartItem2Mock = () => ({
  id: 2,
  count: 3,
  cart: CartMocks.cartMock(),
  item: RestaurantItemMocks.restaurantItem2Mock(),
});

export const cartItemDtoMock = () => ({
  id: 1,
  count: 2,
  item: RestaurantItemMocks.restaurantItemDtoMock(),
  price: 2 * RestaurantItemMocks.restaurantItemDtoMock().price,
});
export const cartItem2DtoMock = () => ({
  id: 2,
  count: 3,
  item: RestaurantItemMocks.restaurantItem2DtoMock(),
  price: 3 * RestaurantItemMocks.restaurantItem2DtoMock().price,
});
