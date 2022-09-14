import { UserRole } from './user.interface';

export interface CreateUserI {
  username?: string;
  password?: string;
  accountType?: UserRole;
}
