import { environment } from '../../../environments/environment';

export function getRestaurantImageUrl(image: string | undefined): string {
  return image
    ? `${environment.apiUrl}/uploads/restaurants/${image}`
    : 'assets/images/restaurant-default.jpg';
}

export function getRestaurantItemImageUrl(image: string | undefined): string {
  return image
    ? `${environment.apiUrl}/uploads/restaurant-items/${image}`
    : 'assets/images/restaurant-default.jpg';
}
