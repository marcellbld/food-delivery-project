import { AutoMap } from '@automapper/classes';
import { RestaurantDto } from '../restaurant/restaurant.dto';

export class RestaurantItemDto {
  @AutoMap()
  id!: number;

  @AutoMap()
  name!: string;

  @AutoMap()
  description?: string;

  @AutoMap()
  restaurant?: RestaurantDto;

  @AutoMap()
  price!: number;

  @AutoMap()
  image?: string;
}
