export interface UpdateRestaurantI {
  id: string;
  description: string;
  categories?: number[];
  file?: File;
}
