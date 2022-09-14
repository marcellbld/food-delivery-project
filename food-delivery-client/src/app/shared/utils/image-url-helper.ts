import { environment } from '../../../environments/environment';

export function getRestaurantImageUrl(image: string | undefined): string {
  const filename = image || 'default.jpg';

  return `${environment.apiUrl}/uploads/restaurants/${filename}`;
}

export function getRestaurantItemImageUrl(image: string | undefined): string {
  const filename = image || 'burger.png';

  return `${environment.apiUrl}/uploads/restaurant-items/${filename}`; //TEMP
}
