import { UserRole } from '../../src/users/user-role';

export const createUserMock = () => ({
  username: 'user1',
  password: 'pass1',
  accountType: UserRole.User,
});

export const userMock = () => ({
  id: 1,
  username: 'user1',
  password: 'hashedpassword',
  role: UserRole.User,
  createdAt: new Date(1000000000000),
  ownedRestaurants: {} as any,
  carts: {} as any,
});

export const userDtoMock = () => ({
  id: 1,
  username: 'user1',
  role: UserRole.User,
  createdAt: new Date(1000000000000),
});
