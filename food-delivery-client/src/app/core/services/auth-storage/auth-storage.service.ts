import { Injectable } from '@angular/core';
import { LoginResponseI } from '../../../shared/models/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private static TOKEN_KEY = 'token';
  private static USER_KEY = 'user';

  constructor() {}

  saveUser(loginResponseI: LoginResponseI | null) {
    if (!loginResponseI) {
      localStorage.removeItem(AuthStorageService.TOKEN_KEY);
      localStorage.removeItem(AuthStorageService.USER_KEY);
      return;
    }

    localStorage.setItem(
      AuthStorageService.TOKEN_KEY,
      loginResponseI.access_token
    );
    localStorage.setItem(
      AuthStorageService.USER_KEY,
      JSON.stringify(loginResponseI.user)
    );
  }

  loadUser(): LoginResponseI | null {
    const token = localStorage.getItem(AuthStorageService.TOKEN_KEY);
    const userJSON = localStorage.getItem(AuthStorageService.USER_KEY);

    if (!(token && userJSON)) {
      return null;
    }
    return {
      access_token: token,
      user: JSON.parse(userJSON),
    };
  }
}
