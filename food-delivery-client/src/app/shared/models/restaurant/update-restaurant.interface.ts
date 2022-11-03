export interface UpdateRestaurantI {
  id: string;
  description: string;
  location: number[];
  categories?: number[];
  file?: File;
}
