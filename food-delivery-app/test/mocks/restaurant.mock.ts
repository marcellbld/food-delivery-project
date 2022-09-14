import * as UserMocks from './user.mock';

export const restaurantMock = () => ({
  id: 1,
  name: 'Test Restaurant',
  description: 'Something',
  image: 'default.jpg',
  createdAt: new Date(1000000000000),
  modifiedAt: new Date(1200000000000),
  owner: UserMocks.userMock(),
  categories: { toArray: jest.fn() } as any,
  items: { toArray: jest.fn() } as any,
  carts: { toArray: jest.fn() } as any,
});

export const restaurant2Mock = () => ({
  id: 2,
  name: 'Test Restaurant 2',
  description: 'Something 2',
  image: 'default.jpg',
  createdAt: new Date(1100000000000),
  modifiedAt: new Date(1300000000000),
  owner: UserMocks.userMock(),
  categories: { toArray: jest.fn() } as any,
  items: { toArray: jest.fn() } as any,
  carts: { toArray: jest.fn() } as any,
});

export const restaurantDtoMock = () => ({
  id: 1,
  name: 'Test Restaurant',
  description: 'Something',
  image: 'default.jpg',
  createdAt: new Date(1000000000000),
  categories: undefined,
});

export const restaurant2DtoMock = () => ({
  id: 2,
  name: 'Test Restaurant 2',
  description: 'Something 2',
  image: 'default.jpg',
  createdAt: new Date(1100000000000),
  categories: undefined,
});

export const createRestaurantMock = () => ({
  name: 'Test Restaurant',
  description: 'Something',
  owner: 1,
});
