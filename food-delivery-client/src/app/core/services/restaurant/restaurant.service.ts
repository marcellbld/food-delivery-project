import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { AuthService } from '../auth/auth.service';
import { CreateRestaurantI } from '../../../shared/models/restaurant/create-restaurant.interface';
import { RestaurantItemI } from '../../../shared/models/restaurant-item/restaurant-item.interface';
import { CreateRestaurantItemI } from '../../../shared/models/restaurant-item/create-restaurant-item.interface';
import { UserRole } from '../../../shared/models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  selfRestaurants: RestaurantI[] | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.authService.loginChange$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.loadSelfRestaurants();
      } else {
        this.selfRestaurants = undefined;
      }
    });

    this.loadSelfRestaurants();
  }

  private loadSelfRestaurants() {
    if (this.authService.loggedInUser()?.role === UserRole.Owner) {
      this.findSelf().subscribe((result) => {
        this.selfRestaurants = result;
      });
    }
  }

  findAll(skip: number = 0): Observable<RestaurantI[]> {
    return this.http.get<RestaurantI[]>(`/api/restaurants?skip=${skip}`);
  }

  findOne(id: number): Observable<RestaurantI> {
    return this.http.get<RestaurantI>(`/api/restaurants/${id}`);
  }

  findSelf(): Observable<RestaurantI[]> {
    return this.http.get<RestaurantI[]>(`/api/restaurants/self`);
  }

  create(createRestaurant: CreateRestaurantI): Observable<RestaurantI> {
    const formData = new FormData();
    formData.append('name', createRestaurant.name);
    formData.append('description', createRestaurant.description);
    formData.append('owner', '' + createRestaurant.owner);
    //formData.append('categories', JSON.stringify(createRestaurant.categories));
    if (createRestaurant.file) {
      formData.append(
        'file',
        createRestaurant.file,
        createRestaurant.file.name
      );
    }
    return this.http.post<RestaurantI>(`/api/restaurants`, formData).pipe(
      tap((_: any) => {
        this.loadSelfRestaurants();
      })
    );
  }

  createItem(
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

  isRestaurantNameTaken(name: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/restaurants/is-name-taken/${name}`);
  }
}