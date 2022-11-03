import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRole } from '../../../shared/models/user/user.interface';
import { UserService } from '../../../core/services/user/user.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { UsernameTakenValidator } from '../../validators/username-taken.validator';
import { MapInputComponent } from 'src/app/shared/components/map-input/map-input.component';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
})
export class RegistrationPageComponent implements OnInit {
  @ViewChild('mapInput') mapInput: MapInputComponent | undefined;

  form = new FormGroup(
    {
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(12),
        ],
        asyncValidators: [
          this.usernameTakenValidator.validate.bind(
            this.usernameTakenValidator
          ),
        ],
        updateOn: 'blur',
      }),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      passwordConfirm: new FormControl('', [Validators.required]),
      accountType: new FormControl('USER', Validators.required),
    },
    {
      validators: passwordMatchValidator,
    }
  );

  apiProgress = false;
  signUpSuccess = false;

  location: Coordinate | undefined;

  constructor(
    private readonly userService: UserService,
    private readonly usernameTakenValidator: UsernameTakenValidator,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onClickSignUp(): void {
    if (!this.form.valid || this.mapInput?.formError) return;

    this.apiProgress = true;
    this.userService
      .create({
        username: this.username?.value!,
        password: this.password?.value!,
        accountType: (this.accountType?.value as UserRole) || UserRole.User,
        address: this.accountType?.value === UserRole.User ? this.location : [],
      })
      .subscribe({
        next: () => {
          this.signUpSuccess = true;
          this.router.navigate(['']);
        },
        error: () => {
          this.apiProgress = false;
        },
      });
  }

  accountTypeChanged() {
    // Refresh Map
    setTimeout(() => {
      this.location = undefined;

      if (this.location) {
        this.mapInput?.locationChanged(this.location);
      }
    }, 0);
  }

  isDisabled() {
    const formFilled =
      this.username?.value &&
      this.password?.value &&
      this.passwordConfirm?.value &&
      (this.accountType?.value === UserRole.User ? this.location : true);

    const validationError =
      this.usernameError ||
      this.passwordError ||
      this.passwordConfirmError ||
      this.mapInput?.formError;

    return !formFilled || validationError !== undefined;
  }

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get accountType() {
    return this.form.get('accountType');
  }
  get usernameError() {
    const field = this.username;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Username is required';
      } else if (field.errors['minlength'] || field.errors['maxlength']) {
        return 'Username must be between 4 and 20 characters long';
      } else if (field.errors['usernameTaken']) {
        return 'Username is already taken.';
      }
    }
    return;
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
    if (this.form?.errors && (this.form?.touched || this.form?.dirty)) {
      if (this.form?.errors['passwordMatch']) {
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
