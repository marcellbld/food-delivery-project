import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { CreateUserI } from '../../../shared/models/user/create-user.interface';
import { UserI } from '../../../shared/models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  findById(id: number): Observable<UserI> {
    return this.http.get<UserI>(`/api/users/${id}`);
  }

  create(user: CreateUserI): Observable<UserI> {
    return this.http.post<UserI>(`/api/users`, user).pipe(
      tap({
        next: (user: UserI) => {
          console.log('User successfully created', user);
        },
        error: (e) => {
          console.log(e);

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
        next: (user: UserI) => {
          console.log('User successfully updated', user);
        },
        error: (e) => {
          console.log(e);

          return throwError(() => e);
        },
      })
    );
  }
}
