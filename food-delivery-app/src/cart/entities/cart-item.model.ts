import { AutoMap } from '@automapper/classes';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { RestaurantItem } from '../../restaurants/entities/restaurant-item.model';
import { Cart } from './cart.model';

@Entity()
export class CartItem {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property({ default: 1 })
  count!: number;

  @ManyToOne(() => Cart, { onDelete: 'cascade' })
  cart!: Cart;

  @AutoMap()
  @ManyToOne(() => RestaurantItem, {
    nullable: true,
  })
  item!: RestaurantItem;
}
