export interface CreateRestaurantI {
  name: string;
  description: string;
  owner: number;
  categories?: number[];
  file?: File;
}
