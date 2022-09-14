import { CategoryI } from '../category/category.interface';

export interface RestaurantI {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  categories: CategoryI[];
  image: string;
}
