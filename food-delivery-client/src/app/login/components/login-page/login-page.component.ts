import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  apiProgress = false;

  loginError: string | undefined;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onClickLogin(): void {
    if (!this.form.valid) return;

    this.apiProgress = true;

    this.authService
      .login({
        username: this.username?.value!,
        password: this.password?.value!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (httpError: HttpErrorResponse) => {
          this.apiProgress = false;

          this.loginError = httpError.error.message;
        },
      });
  }
  isDisabled(): boolean {
    const formFilled = this.username?.value && this.password?.value;

    return !formFilled;
  }
}
