import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
