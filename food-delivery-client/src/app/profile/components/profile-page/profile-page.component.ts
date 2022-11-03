import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart/cart.service';
import { Cart } from '../../../shared/models/cart/cart';
import { UserService } from '../../../core/services/user/user.service';
import { passwordMatchValidator } from '../../../registration/validators/password-match.validator';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole } from '../../../shared/models/user/user.interface';
import { MapInputComponent } from '../../../shared/components/map-input/map-input.component';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('mapInput') mapInput: MapInputComponent | undefined;

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

  changeAddressApiProgress = false;
  changeAddressSuccess = false;

  location: Coordinate | undefined;

  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.findSelf().subscribe((result) => {
      const user = result;

      setTimeout(() => {
        this.location = user.address;
        if (this.location) {
          this.mapInput?.locationChanged(this.location);
        }
      }, 0);
    });
  }

  get deliveredCarts(): Cart[] | undefined {
    return this.cartService.selfDeliveredCarts;
  }

  loggedInUsername(): string {
    return this.authService.loggedInUser()?.username || '';
  }

  loggedInRole(): string {
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
  onChangeAddress(): void {
    if (this.mapInput?.formError || !this.location) return;

    this.changeAddressApiProgress = true;

    this.userService.updateAddress(this.location).subscribe({
      next: () => {
        this.changeAddressSuccess = true;
      },
      error: () => {},
      complete: () => {
        this.changeAddressApiProgress = false;
      },
    });
  }
  isChangeAddressBtnDisabled(): boolean {
    return this.mapInput?.formError !== undefined || !this.location;
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

  get postalCodeError() {
    return this.mapInput?.postalCodeError || null;
  }
  get streetError() {
    return this.mapInput?.streetError || null;
  }
  get houseNumberError() {
    return this.mapInput?.houseNumberError || null;
  }
  get invalidAddressError() {
    return this.mapInput?.invalidAddressError || null;
  }
}
