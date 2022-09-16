import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantItemDto {
  @IsString()
  id!: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  price?: string;
}
