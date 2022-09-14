import { AutoMap } from '@automapper/classes';
import { UserRole } from '../user-role';

export class UserDto {
  @AutoMap()
  id?: number;

  @AutoMap()
  username?: string;

  @AutoMap()
  role?: UserRole;

  @AutoMap()
  createdAt?: Date;
}
