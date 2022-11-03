import { AutoMap } from '@automapper/classes';
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Cart } from '../../cart/entities/cart.model';
import { User } from '../../users/entities/user.model';

@Entity()
export class Order {
  @AutoMap()
  @PrimaryKey()
  id!: number;

  @AutoMap()
  @Property()
  commission!: number;

  @AutoMap(() => User)
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'set null',
  })
  courier!: User;

  @AutoMap(() => Cart)
  @OneToOne({
    entity: () => Cart,
    inversedBy: 'order',
    strategy: LoadStrategy.JOINED,
  })
  cart!: Cart;

  @AutoMap()
  @Property()
  deliveryTime!: Date;

  @AutoMap()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
