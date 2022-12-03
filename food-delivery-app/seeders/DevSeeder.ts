import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { RestaurantItem } from '../src/restaurants/entities/restaurant-item.model';
import { Restaurant } from '../src/restaurants/entities/restaurant.model';
import { Category } from '../src/categories/entities/category.model';
import { User } from '../src/users/entities/user.model';
import { UserRole } from '../src/users/user-role';
import { Cart } from '../src/cart/entities/cart.model';
import { CartItem } from '../src/cart/entities/cart-item.model';
import { hashPassword } from '../src/auth/utils/auth-helper';

export class DevSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const admin = em.create(User, {
      username: 'admin',
      password: await hashPassword('admin'),
      role: UserRole.Admin,
    });
    const users = [];
    for (let i = 0; i < 2; i++) {
      users.push(
        em.create(User, {
          username: `user${i + 1}`,
          password: await hashPassword('pass'),
          role: UserRole.User,
          addressLon: 19.04980834146211,
          addressLat: 47.49839263327843,
        }),
      );
    }
    const owners = [];
    for (let i = 0; i < 2; i++) {
      owners.push(
        em.create(User, {
          username: `owner${i + 1}`,
          password: await hashPassword('pass'),
          role: UserRole.Owner,
        }),
      );
    }
    const couriers = [];
    for (let i = 0; i < 1; i++) {
      couriers.push(
        em.create(User, {
          username: `courier${i + 1}`,
          password: await hashPassword('pass'),
          role: UserRole.Courier,
        }),
      );
    }

    const categories = [];
    categories.push(
      em.create(Category, { id: 1, name: 'Primary 1', primary: true }),
    );
    categories.push(
      em.create(Category, { id: 2, name: 'Primary 2', primary: true }),
    );
    categories.push(
      em.create(Category, { id: 3, name: 'Secondary 1', primary: false }),
    );
    categories.push(
      em.create(Category, { id: 4, name: 'Secondary 2', primary: false }),
    );

    const restaurants = [];
    restaurants.push(
      em.create(Restaurant, {
        id: 1,
        name: 'Test Restaurant',
        description:
          'Test Restaurant Description. Test Restaurant Description. Test Restaurant Description. Test Restaurant Description. Test Restaurant Description. Test Restaurant Description',
        owner: owners[0],
        locationLat: 47.502837766383294,
        locationLon: 19.04717848426026,
        categories: [1, 2, 3, 4],
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 2,
        name: 'Test Restaurant 2',
        description: '',
        owner: owners[1],
        locationLat: 47.50215474954456,
        locationLon: 19.04960806009421,
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 3,
        name: 'Test Restaurant 3',
        description: 'Test Restaurant Description 3',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 4,
        name: 'Mc Donalds',
        description: 'Mc Donalds Description',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 5,
        name: 'Burger King (Corvin)',
        description: 'Burger King (Corvin) Description',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 6,
        name: 'Pesti Pipi',
        description: 'Pesti Pipi Description',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
      }),
    );

    const restaurantItems = [];
    for (let i = 0; i < 3; i++) {
      restaurantItems.push(
        em.create(RestaurantItem, {
          id: i + 1,
          name: `Test Item ${i + 1}`,
          image: null,
          description: 'Test Item Description',
          price: 0.05 + (i + 1),
          restaurant: restaurants[0],
        }),
      );
    }
    restaurantItems.push(
      em.create(RestaurantItem, {
        id: 4,
        name: `Test Item 4`,
        image: null,
        description: 'Test Item Description',
        price: 4.05,
        restaurant: restaurants[1],
      }),
    );

    const carts = [];
    carts.push(
      em.create(Cart, {
        purchased: false,
        purchasedDate: null,
        restaurant: restaurants[0],
        user: users[0],
      }),
    );

    em.create(CartItem, {
      count: 1,
      cart: carts[0],
      item: restaurantItems[0],
    });
    em.create(CartItem, {
      count: 2,
      cart: carts[0],
      item: restaurantItems[1],
    });
  }
}
