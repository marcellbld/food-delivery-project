export class CreateRestaurantDto {
  name: string;
  description: string;
  owner: number;
  location?: number[];
  categories?: number[];
  image?: string;
}
