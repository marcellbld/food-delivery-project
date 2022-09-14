import { environment } from '../../../environments/environment';

export function getRestaurantImageUrl(image: string | undefined): string {
  return image
    ? `${environment.apiUrl}/uploads/restaurants/${image}`
    : 'assets/images/restaurant-default.jpg';
}

export function getRestaurantItemImageUrl(image: string | undefined): string {
  const filename = image || 'burger.png';

  return `${environment.apiUrl}/uploads/restaurant-items/${filename}`; //TEMP
}
