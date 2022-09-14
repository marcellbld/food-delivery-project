import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantItemDto {
  @IsNumber()
  id!: number;
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
