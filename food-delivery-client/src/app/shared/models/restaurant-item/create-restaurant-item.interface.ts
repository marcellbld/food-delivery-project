export interface CreateRestaurantItemI {
  name: string;
  description?: string;
  restaurant: number;
  price: number;
  file?: File;
}
