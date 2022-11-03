import { IDatabaseDriver, Options } from '@mikro-orm/core';
import { Order } from './src/orders/entities/order.model';
import { CartItem } from './src/cart/entities/cart-item.model';
import { Cart } from './src/cart/entities/cart.model';
import { Category } from './src/categories/entities/category.model';
import { RestaurantItem } from './src/restaurants/entities/restaurant-item.model';
import { Restaurant } from './src/restaurants/entities/restaurant.model';
import { User } from './src/users/entities/user.model';

export default {
  entities: [User, Category, Restaurant, RestaurantItem, Cart, CartItem, Order],
  dbName:
    (process.env.seed ? './dist/' : '') +
    (process.env.dbName || 'food-delivery-db.sqlite3'),
  type: 'sqlite',
  migrations: {
    path: 'migrations',
    pattern: /^[\w-]+\d+\.(ts|js)$/,
  },
  seeder: {
    defaultSeeder: process.env.seeder,
    path: 'seeders',
    pathTs: 'seeders',
    emit: 'ts',
  },
} as Options<IDatabaseDriver>;
