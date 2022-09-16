import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateRestaurantItemI } from '../../../shared/models/restaurant-item/update-restaurant-item.interface';
import { CreateRestaurantItemI } from '../../../shared/models/restaurant-item/create-restaurant-item.interface';
import { RestaurantItemI } from '../../../shared/models/restaurant-item/restaurant-item.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantItemService {
  constructor(private http: HttpClient) {}

  findAll(restaurantId: number): Observable<RestaurantItemI[]> {
    return this.http.get<RestaurantItemI[]>(
      `/api/restaurants/${restaurantId}/items`
    );
  }
  findAllPopulars(restaurantId: number): Observable<RestaurantItemI[]> {
    return this.http.get<RestaurantItemI[]>(
      `/api/restaurants/${restaurantId}/items/popular`
    );
  }

  create(
    createRestaurantItemI: CreateRestaurantItemI
  ): Observable<RestaurantItemI> {
    const formData = new FormData();
    formData.append('name', createRestaurantItemI.name);
    formData.append('description', '' + createRestaurantItemI.description);
    formData.append('restaurant', '' + createRestaurantItemI.restaurant);
    formData.append('price', createRestaurantItemI.price.toString());
    if (createRestaurantItemI.file) {
      formData.append(
        'file',
        createRestaurantItemI.file,
        createRestaurantItemI.file.name
      );
    }
    return this.http.post<RestaurantItemI>(
      `/api/restaurants/${createRestaurantItemI.restaurant}/items`,
      formData
    );
  }
  update(restaurantItemI: UpdateRestaurantItemI): Observable<RestaurantItemI> {
    const formData = new FormData();
    formData.append('id', '' + restaurantItemI.id);
    formData.append('name', '' + restaurantItemI.name);
    formData.append('description', '' + restaurantItemI.description);
    formData.append('price', '' + restaurantItemI.price);
    if (restaurantItemI.file) {
      formData.append('file', restaurantItemI.file, restaurantItemI.file.name);
    }
    return this.http.patch<RestaurantItemI>(
      `/api/restaurants/${restaurantItemI.restaurant}/items`,
      formData
    );
  }

  delete(restaurantId: number, restaurantItemId: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `/api/restaurants/${restaurantId}/items/${restaurantItemId}`
    );
  }
}
