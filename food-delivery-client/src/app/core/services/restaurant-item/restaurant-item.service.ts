import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      `/api${createRestaurantItemI.restaurant}/items`,
      formData
    );
  }
}
