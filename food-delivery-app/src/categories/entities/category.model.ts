import { AutoMap } from '@automapper/classes';
import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Restaurant } from '../../restaurants/entities/restaurant.model';

@Entity()
export class Category {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property({ unique: true })
  name!: string;

  @AutoMap()
  @Property({ default: false })
  primary!: boolean;

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.categories)
  restaurants = new Collection<Restaurant>(this);
}
