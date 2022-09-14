import * as RestaurantMocks from './restaurant.mock';
import * as UserMocks from './user.mock';

export const cartMock = () => ({
  id: 1,
  purchased: false,
  cartItems: { toArray: jest.fn() } as any,
  restaurant: RestaurantMocks.restaurantMock(),
  user: UserMocks.userMock(),
});

export const cartDtoMock = () => ({
  id: 1,
  purchased: false,
  purchasedDate: undefined,
  cartItems: undefined,
  restaurant: RestaurantMocks.restaurantDtoMock(),
  user: UserMocks.userDtoMock(),
});

export const purchasedCartMock = () => ({
  id: 1,
  purchased: true,
  purchasedDate: new Date(1000000000000),
  cartItems: { toArray: jest.fn() } as any,
  restaurant: RestaurantMocks.restaurantMock(),
  user: UserMocks.userMock(),
});

export const purchasedCart2Mock = () => ({
  id: 2,
  purchased: true,
  purchasedDate: new Date(1100000000000),
  cartItems: { toArray: jest.fn() } as any,
  restaurant: RestaurantMocks.restaurantMock(),
  user: UserMocks.userMock(),
});

export const purchasedCartDtoMock = () => ({
  id: 1,
  purchased: true,
  purchasedDate: new Date(1000000000000),
  cartItems: undefined,
  restaurant: RestaurantMocks.restaurantDtoMock(),
  user: UserMocks.userDtoMock(),
});

export const purchasedCart2DtoMock = () => ({
  id: 2,
  purchased: true,
  purchasedDate: new Date(1100000000000),
  cartItems: undefined,
  restaurant: RestaurantMocks.restaurantDtoMock(),
  user: UserMocks.userDtoMock(),
});
