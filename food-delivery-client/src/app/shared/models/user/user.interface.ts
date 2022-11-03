export interface UserI {
  id?: number;
  username?: string;
  role?: UserRole;
  createdAt?: Date;
  address?: number[];
}

export enum UserRole {
  Admin = 'ADMIN',
  Owner = 'OWNER',
  Courier = 'COURIER',
  User = 'USER',
}
