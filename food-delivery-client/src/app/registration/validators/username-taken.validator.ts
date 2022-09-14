import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidator,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from '../../core/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UsernameTakenValidator implements AsyncValidator {
  constructor(private readonly userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;
    if (!control?.errors) {
      return this.userService.isUsernameTaken(username).pipe(
        map((isTaken) => (isTaken ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      );
    }

    return of(null);
  }
}
