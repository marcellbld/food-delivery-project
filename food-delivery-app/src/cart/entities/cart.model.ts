import { AutoMap } from '@automapper/classes';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Restaurant } from '../../restaurants/entities/restaurant.model';
import { User } from '../../users/entities/user.model';
import { CartItem } from './cart-item.model';

@Entity()
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
}
