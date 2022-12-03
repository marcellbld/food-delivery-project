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
      em.create(Category, { id: 1, name: 'Fast Food', primary: true }),
      em.create(Category, { id: 2, name: 'Café', primary: true }),
      em.create(Category, { id: 3, name: 'Fine Dining', primary: true }),
      em.create(Category, { id: 4, name: 'American', primary: true }),
      em.create(Category, { id: 5, name: 'Indian', primary: true }),
      em.create(Category, { id: 6, name: 'French', primary: true }),
      em.create(Category, { id: 7, name: 'Italian', primary: true }),
      em.create(Category, { id: 8, name: 'Mexican', primary: true }),
      em.create(Category, { id: 9, name: 'Chinese', primary: true }),
      em.create(Category, { id: 10, name: 'Burger', primary: false }),
      em.create(Category, { id: 11, name: 'Pizza', primary: false }),
      em.create(Category, { id: 12, name: 'Salad', primary: false }),
      em.create(Category, { id: 13, name: 'Hot Dog', primary: false }),
      em.create(Category, { id: 14, name: 'Chicken', primary: false }),
      em.create(Category, { id: 15, name: 'Pasta', primary: false }),
      em.create(Category, { id: 16, name: 'Dessert', primary: false }),
      em.create(Category, { id: 17, name: 'Sandwich', primary: false }),
      em.create(Category, { id: 18, name: 'Gyros', primary: false }),
      em.create(Category, { id: 19, name: 'Sushi', primary: false }),
      em.create(Category, { id: 20, name: 'Fish', primary: false }),
      em.create(Category, { id: 21, name: 'Vegan', primary: false }),
      em.create(Category, { id: 22, name: 'Kebab', primary: false }),
      em.create(Category, { id: 23, name: 'Steak', primary: false }),
      em.create(Category, { id: 24, name: 'Bakery', primary: false }),
      em.create(Category, { id: 25, name: 'BBQ', primary: false }),
      em.create(Category, { id: 26, name: 'Ice Cream', primary: false }),
      em.create(Category, { id: 27, name: 'Waffle', primary: false }),
      em.create(Category, { id: 28, name: 'Pancake', primary: false }),
      em.create(Category, { id: 29, name: 'International', primary: true }),
    );

    const restaurants = [];
    restaurants.push(
      em.create(Restaurant, {
        id: 1,
        name: 'The Grand Rose',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac viverra odio. Fusce ullamcorper libero sed enim rutrum tincidunt.',
        owner: owners[0],
        locationLat: 47.502837766383294,
        locationLon: 19.04717848426026,
        categories: [3, 29],
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 2,
        name: 'Babylon Burger',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac viverra odio. Fusce ullamcorper libero sed enim rutrum tincidunt.',
        owner: owners[1],
        locationLat: 47.50215474954456,
        locationLon: 19.04960806009421,
        categories: [1, 10, 11, 13, 25],
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 3,
        name: 'Empty Restaurant',
        description: '',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 4,
        name: 'Little Italy',
        description: 'Little Italy Description',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
        categories: [7, 11, 15],
      }),
    );
    restaurants.push(
      em.create(Restaurant, {
        id: 5,
        name: 'Corner Gyros',
        description: 'Corner Gyros Description',
        owner: owners[0],
        locationLat: 47.50422866176311,
        locationLon: 19.048248127736755,
        categories: [18, 22, 17, 10, 13, 14, 26],
      }),
    );

    const restaurantItems = [];
    restaurantItems.push(
      em.create(RestaurantItem, {
        id: 1,
        name: `Roasted Parmesan Boar`,
        image: null,
        description: 'Roasted Parmesan Boar Description',
        price: 10.5,
        restaurant: restaurants[0],
      }),
      em.create(RestaurantItem, {
        id: 2,
        name: `Dried Garlic & Ginger Lobster`,
        image: null,
        description: 'Dried Garlic & Ginger Lobster Description',
        price: 12.25,
        restaurant: restaurants[0],
      }),
      em.create(RestaurantItem, {
        id: 3,
        name: `Steamed Butter Salmon`,
        image: null,
        description: 'Steamed Butter Salmon BoarDescription',
        price: 8.0,
        restaurant: restaurants[0],
      }),
    );
    restaurantItems.push(
      em.create(RestaurantItem, {
        id: 4,
        name: `Lime Mammoth Burger`,
        image: null,
        description: 'Item Description',
        price: 4.05,
        restaurant: restaurants[1],
      }),
      em.create(RestaurantItem, {
        id: 5,
        name: `Lime Mammoth Burger XXL`,
        image: null,
        description: 'Item Description',
        price: 7.1,
        restaurant: restaurants[1],
      }),
      em.create(RestaurantItem, {
        id: 6,
        name: `Coke`,
        image: null,
        description: 'Item Description',
        price: 1.5,
        restaurant: restaurants[1],
      }),
      em.create(RestaurantItem, {
        id: 7,
        name: `Zero Coke`,
        image: null,
        description: 'Item Description',
        price: 1.5,
        restaurant: restaurants[1],
      }),
      em.create(RestaurantItem, {
        id: 8,
        name: `Lemonade`,
        image: null,
        description: 'Item Description',
        price: 1.75,
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
