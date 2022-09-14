import { IsOptional, IsString } from 'class-validator';

export class CreateRestaurantItemDto {
  @IsString()
  name!: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsString()
  price!: string;

  @IsOptional()
  @IsString()
  image?: string;
}
