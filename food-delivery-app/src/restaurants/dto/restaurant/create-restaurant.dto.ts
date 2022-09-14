export class CreateRestaurantDto {
  name: string;
  description: string;
  owner: number;
  categories?: number[];
  image?: string;
}
