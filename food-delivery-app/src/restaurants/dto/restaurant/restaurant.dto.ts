import { AutoMap } from '@automapper/classes';
import { CategoryDto } from '../../../categories/dto/category.dto';

export class RestaurantDto {
  @AutoMap()
  id!: number;
  @AutoMap()
  name!: string;
  @AutoMap()
  description!: string;
  @AutoMap()
  createdAt!: Date;
  @AutoMap()
  location!: number[];
  @AutoMap()
  categories!: CategoryDto[];
  @AutoMap()
  image?: string;
}
