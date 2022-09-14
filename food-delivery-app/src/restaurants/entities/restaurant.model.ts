import { AutoMap } from '@automapper/classes';
import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Cart } from '../../cart/entities/cart.model';
import { Category } from '../../categories/entities/category.model';
import { User } from '../../users/entities/user.model';
import { RestaurantItem } from './restaurant-item.model';

@Entity()
export class Restaurant {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property({ unique: true })
  name!: string;

  @AutoMap()
  @Property({ nullable: true })
  image: string;

  @AutoMap()
  @Property()
  description!: string;

  @AutoMap()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @AutoMap()
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  modifiedAt!: Date;

  @AutoMap(() => User)
  @ManyToOne(() => User)
  owner!: User;

  @AutoMap()
  @ManyToMany(() => Category)
  categories = new Collection<Category>(this);

  @OneToMany(() => RestaurantItem, (item) => item.restaurant, {
    cascade: [Cascade.REMOVE],
  })
  items = new Collection<RestaurantItem>(this);

  @OneToMany(() => Cart, (cart) => cart.restaurant)
  carts = new Collection<Cart>(this);
}
