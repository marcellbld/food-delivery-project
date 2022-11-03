import { AutoMap } from '@automapper/classes';
import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Order } from '../../orders/entities/order.model';
import { Cart } from '../../cart/entities/cart.model';
import { Restaurant } from '../../restaurants/entities/restaurant.model';
import { UserRole } from '../user-role';

@Entity()
export class User {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property()
  @Unique()
  username!: string;

  @Property()
  password!: string;

  @AutoMap()
  @Property()
  role!: UserRole;

  @AutoMap()
  @Property({ nullable: true })
  addressLat?: number;

  @AutoMap()
  @Property({ nullable: true })
  addressLon?: number;

  @AutoMap()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @AutoMap()
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  ownedRestaurants = new Collection<Restaurant>(this);

  @AutoMap()
  @OneToMany(() => Cart, (cart) => cart.user)
  carts = new Collection<Cart>(this);

  @AutoMap()
  @OneToMany(() => Order, (order) => order.courier)
  courierOrders = new Collection<Order>(this);
}
