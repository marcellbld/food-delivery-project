import { UserI } from './user/user.interface';

export interface LoginResponseI {
  access_token: string;
  user: UserI;
}
