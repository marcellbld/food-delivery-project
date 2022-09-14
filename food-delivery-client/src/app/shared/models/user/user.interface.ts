export interface UserI {
  id?: number;
  username?: string;
  role?: UserRole;
  createdAt?: Date;
}

export enum UserRole {
  Admin = 'ADMIN',
  Owner = 'OWNER',
  User = 'USER',
}
