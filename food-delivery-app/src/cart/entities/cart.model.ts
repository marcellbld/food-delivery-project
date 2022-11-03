import { AutoMap } from '@automapper/classes';
import {
  Collection,
  Entity,
  Filter,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Order } from '../../orders/entities/order.model';
import { Restaurant } from '../../restaurants/entities/restaurant.model';
import { User } from '../../users/entities/user.model';
import { CartItem } from './cart-item.model';

@Entity()
@Filter({
  name: 'undelivered',
  cond: { order: { $eq: null } },
})
export class Cart {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property({ default: false })
  purchased!: boolean;

  @AutoMap()
  @Property({ nullable: true })
  purchasedDate?: Date;

  @AutoMap()
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems = new Collection<CartItem>(this);

  @AutoMap(() => Restaurant)
  @ManyToOne(() => Restaurant, {
    nullable: true,
    onDelete: 'set null',
  })
  restaurant!: Restaurant;

  @AutoMap(() => User)
  @ManyToOne(() => User)
  user!: User;

  @AutoMap(() => Order)
  @OneToOne({
    entity: () => Order,
    mappedBy: 'cart',
    nullable: true,
  })
  order?: Order;
}
