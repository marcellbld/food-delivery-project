import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Observable, tap, throwError } from 'rxjs';
import { CreateUserI } from '../../../shared/models/user/create-user.interface';
import { UserI } from '../../../shared/models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  findSelf(): Observable<UserI> {
    return this.http.get<UserI>(`/api/users`);
  }
  findById(id: number): Observable<UserI> {
    return this.http.get<UserI>(`/api/users/${id}`);
  }

  create(user: CreateUserI): Observable<UserI> {
    return this.http.post<UserI>(`/api/users`, user).pipe(
      tap({
        next: (user: UserI) => {},
        error: (e) => {
          return throwError(() => e);
        },
      })
    );
  }

  isUsernameTaken(username: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/users/is-username-taken/${username}`);
  }

  update(password: string): Observable<UserI> {
    return this.http.patch<UserI>(`/api/users`, { password }).pipe(
      tap({
        next: (user: UserI) => {},
        error: (e) => {
          return throwError(() => e);
        },
      })
    );
  }
  updateAddress(location: number[] | Coordinate): Observable<UserI> {
    return this.http
      .patch<UserI>(`/api/users/address`, { address: location })
      .pipe(
        tap({
          next: (user: UserI) => {},
          error: (e) => {
            return throwError(() => e);
          },
        })
      );
  }
}
