export interface CreateRestaurantI {
  name: string;
  description: string;
  owner: number;
  location: number[];
  categories?: number[];
  file?: File;
}
