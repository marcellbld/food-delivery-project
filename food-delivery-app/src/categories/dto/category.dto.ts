import { AutoMap } from '@automapper/classes';

export class CategoryDto {
  @AutoMap()
  id?: number;
  @AutoMap()
  name?: string;
  @AutoMap()
  primary?: boolean;
}
