import * as RestaurantMocks from './restaurant.mock';

export const createRestaurantItemMock = () => ({
  name: 'Restaurant Item',
  description: 'Item Description',
  price: '1.99',
  image: null,
});

export const restaurantItemMock = () => ({
  id: 1,
  name: 'Restaurant Item',
  description: 'Item Description',
  price: 1.99,
  restaurant: RestaurantMocks.restaurantMock(),
  cartItems: {} as any,
  image: null,
});

export const restaurantItem2Mock = () => ({
  id: 2,
  name: 'Restaurant Item 2',
  description: 'Item Description',
  price: 2.99,
  restaurant: RestaurantMocks.restaurantMock(),
  cartItems: {} as any,
  image: null,
});

export const restaurantItemDtoMock = () => ({
  id: 1,
  name: 'Restaurant Item',
  description: 'Item Description',
  price: 1.99,
  restaurant: RestaurantMocks.restaurantDtoMock(),
  image: null,
});

export const restaurantItem2DtoMock = () => ({
  id: 2,
  name: 'Restaurant Item 2',
  description: 'Item Description',
  price: 2.99,
  restaurant: RestaurantMocks.restaurantDtoMock(),
  image: null,
});
