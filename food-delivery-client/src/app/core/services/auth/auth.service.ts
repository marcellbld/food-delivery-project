import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  delay,
  Observable,
  of,
  Subject,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { LoginResponseI } from '../../../shared/models/login-response.interface';
import { AuthUserI } from '../../../shared/models/user/auth-user.interface';
import { UserI } from '../../../shared/models/user/user.interface';
import { AuthStorageService } from '../auth-storage/auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string | null = null;
  private _loggedInUser: UserI | null = null;

  private loginSubject = new Subject<boolean>();
  loginChange$ = this.loginSubject.asObservable();

  tokenSubscription = new Subscription();

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private authStorageService: AuthStorageService
  ) {
    const result = this.authStorageService.loadUser();

    if (result) {
      this.setLoginResponse(result);
    }
  }

  get token(): string | null {
    return this._token;
  }

  loggedInUser(): UserI | null {
    return this._loggedInUser;
  }

  isLoggedIn(): boolean {
    return this._token !== null;
  }
  logout() {
    this.authStorageService.saveUser(null);

    this.setLoginResponse(null);

    this.loginSubject.next(false);

    this.tokenSubscription.unsubscribe();
  }

  login(user: AuthUserI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>(`/api/auth/login`, user).pipe(
      tap({
        next: (res: LoginResponseI) => {
          const decodedUser = this.jwtHelperService.decodeToken(
            res.access_token
          );

          const result = {
            access_token: res.access_token,
            user: decodedUser,
          };

          this.authStorageService.saveUser(result);
          this.setLoginResponse(result);

          this.loginSubject.next(true);
        },
        error: (error) => {
          return throwError(() => new Error(error));
        },
      })
    );
  }

  private setLoginResponse(result: LoginResponseI | null) {
    if (!result) {
      this._token = null;
      this._loggedInUser = null;
      return;
    }
    this._token = result.access_token;
    this._loggedInUser = result.user;
    this.expirationCounter(
      this.jwtHelperService.getTokenExpirationDate(this._token)!.valueOf() -
        new Date().valueOf()
    );
  }

  private expirationCounter(timeout: number) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null)
      .pipe(delay(timeout))
      .subscribe((_) => {
        this.logout();
      });
  }
}
