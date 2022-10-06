import { AutoMap } from '@automapper/classes';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CartItem } from '../../cart/entities/cart-item.model';
import { Restaurant } from './restaurant.model';

@Entity()
export class RestaurantItem {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property()
  name!: string;

  @AutoMap()
  @Property({ nullable: true })
  image: string;

  @AutoMap()
  @Property({ nullable: true })
  description?: string;

  @AutoMap()
  @Property({ precision: 2 })
  price!: number;

  @AutoMap(() => Restaurant)
  @ManyToOne(() => Restaurant)
  restaurant!: Restaurant;

  @OneToMany(() => CartItem, (cartItems) => cartItems.item)
  cartItems = new Collection<CartItem>(this);
}
