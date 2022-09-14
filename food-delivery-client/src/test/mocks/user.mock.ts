import { UserI, UserRole } from '../../app/shared/models/user/user.interface';

export const userMock = {
  id: 1,
  username: 'user1',
  role: UserRole.User,
  createdAt: new Date('9999999'),
} as UserI;
