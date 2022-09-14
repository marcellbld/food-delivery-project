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

export class ProdSeeder extends Seeder {
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
        description: 'Test Restaurant Description',
        owner: owners[0],
        categories: [2, 3],
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 2,
        name: 'Test Restaurant 2',
        description: 'Test Restaurant Description 2',
        owner: owners[0],
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 3,
        name: 'Test Restaurant 3',
        description: 'Test Restaurant Description 3',
        owner: owners[0],
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
    carts.push(
      em.create(Cart, {
        purchased: true,
        purchasedDate: new Date(),
        restaurant: restaurants[0],
        user: users[0],
      }),
    );
    em.create(CartItem, {
      count: 2,
      cart: carts[1],
      item: restaurantItems[0],
    });
    carts.push(
      em.create(Cart, {
        purchased: true,
        purchasedDate: new Date(),
        restaurant: restaurants[0],
        user: users[0],
      }),
    );
    em.create(CartItem, {
      count: 3,
      cart: carts[2],
      item: restaurantItems[0],
    });
  }
}
