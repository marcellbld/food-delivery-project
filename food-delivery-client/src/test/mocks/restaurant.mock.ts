import { RestaurantI } from 'src/app/shared/models/restaurant/restaurant.interface';
import {
  primaryCategory1Mock,
  primaryCategory2Mock,
  secondaryCategory1Mock,
} from './category.mock';

export const restaurantMock = {
  id: 1,
  name: 'Test Restaurant',
  description: 'Test Restaurant Description',
  createdAt: new Date('9999999'),
  categories: [
    primaryCategory1Mock,
    primaryCategory2Mock,
    secondaryCategory1Mock,
  ],
  image: 'image',
} as RestaurantI;
