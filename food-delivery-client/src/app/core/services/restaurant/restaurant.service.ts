import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { AuthService } from '../auth/auth.service';
import { CreateRestaurantI } from '../../../shared/models/restaurant/create-restaurant.interface';
import { UserRole } from '../../../shared/models/user/user.interface';
import { UpdateRestaurantI } from 'src/app/shared/models/restaurant/update-restaurant.interface';

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
  isRestaurantSelf(id: number): boolean {
    if (this.authService.loggedInUser()?.role === UserRole.Admin) return true;

    return (
      this.selfRestaurants?.find((restaurant) => restaurant.id === id) !==
      undefined
    );
  }

  findAll(
    skip: number = 0,
    nameFilter: string = ''
  ): Observable<RestaurantI[]> {
    return this.http.get<RestaurantI[]>(
      `/api/restaurants?skip=${skip}&nameFilter=${nameFilter}`
    );
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
    formData.append('categories', JSON.stringify(createRestaurant.categories));
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

  update(updateRestaurant: UpdateRestaurantI): Observable<RestaurantI> {
    console.log(updateRestaurant.categories);

    const formData = new FormData();
    formData.append('id', updateRestaurant.id);
    formData.append('description', updateRestaurant.description);
    formData.append('categories', JSON.stringify(updateRestaurant.categories));
    if (updateRestaurant.file) {
      formData.append(
        'file',
        updateRestaurant.file,
        updateRestaurant.file.name
      );
    }
    return this.http
      .patch<RestaurantI>(`/api/restaurants/${updateRestaurant.id}`, formData)
      .pipe(
        tap((_: any) => {
          this.loadSelfRestaurants();
        })
      );
  }

  isRestaurantNameTaken(name: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/restaurants/is-name-taken/${name}`);
  }
}
