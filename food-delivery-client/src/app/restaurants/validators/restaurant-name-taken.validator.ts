import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidator,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { RestaurantService } from '../../core/services/restaurant/restaurant.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantNameTakenValidator implements AsyncValidator {
  constructor(private readonly restaurantService: RestaurantService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const name = control.value;
    if (!control?.errors) {
      return this.restaurantService.isRestaurantNameTaken(name).pipe(
        map((isTaken) => (isTaken ? { restaurantNameTaken: true } : null)),
        catchError(() => of(null))
      );
    }

    return of(null);
  }
}
