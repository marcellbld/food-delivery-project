import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart/cart.service';
import { Cart } from '../../../shared/models/cart/cart';
import { UserService } from '../../../core/services/user/user.service';
import { passwordMatchValidator } from '../../../registration/validators/password-match.validator';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole } from '../../../shared/models/user/user.interface';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  changePasswordForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      passwordConfirm: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordMatchValidator,
    }
  );

  changePasswordApiProgress = false;
  changePasswordSuccess = false;

  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {}

  get purchasedCarts(): Cart[] | undefined {
    return this.cartService.selfPurchasedCarts;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get loggedInUsername(): string {
    return this.authService.loggedInUser()?.username || '';
  }
  get loggedInUserRole(): string {
    return this.authService.loggedInUser()?.role || UserRole.User;
  }

  onChangePassword(): void {
    if (!this.changePasswordForm.valid) return;

    this.changePasswordApiProgress = true;

    this.userService.update(this.password?.value!).subscribe({
      next: () => {
        this.changePasswordSuccess = true;
      },
      error: () => {},
      complete: () => {
        this.changePasswordApiProgress = false;
        this.changePasswordForm.reset();
      },
    });
  }
  isChangePasswordBtnDisabled() {
    const formFilled = this.password?.value && this.passwordConfirm?.value;

    const validationError = this.passwordError || this.passwordConfirmError;

    return !formFilled || validationError !== undefined;
  }
  get password() {
    return this.changePasswordForm.get('password');
  }
  get passwordConfirm() {
    return this.changePasswordForm.get('passwordConfirm');
  }
  get passwordError() {
    const field = this.password;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Password is required';
      } else if (field.errors['minlength'] || field.errors['maxlength'])
        return 'Password must be between 4 and 20 characters long';
    }
    return;
  }

  get passwordConfirmError() {
    if (
      this.changePasswordForm?.errors &&
      (this.changePasswordForm?.touched || this.changePasswordForm?.dirty)
    ) {
      if (this.changePasswordForm?.errors['passwordMatch']) {
        return 'Password mismatch';
      }
    }
    return;
  }
}
