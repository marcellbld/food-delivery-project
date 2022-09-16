export interface UpdateRestaurantItemI {
  id: number;
  name?: string;
  description?: string;
  restaurant: number;
  price?: number;
  file?: File;
}
