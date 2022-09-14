import { IsEnum, IsIn, Length } from 'class-validator';
import { UserRole } from '../user-role';

export class CreateUserDto {
  @Length(5, 12)
  username?: string;
  @Length(4, 20)
  password?: string;

  @IsEnum(UserRole)
  @IsIn([UserRole.User, UserRole.Owner])
  accountType: UserRole;
}
