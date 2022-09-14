import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRole } from '../../../shared/models/user/user.interface';
import { UserService } from '../../../core/services/user/user.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { UsernameTakenValidator } from '../../validators/username-taken.validator';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
})
export class RegistrationPageComponent implements OnInit {
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
      accountType: new FormControl('User', Validators.required),
    },
    {
      validators: passwordMatchValidator,
    }
  );

  apiProgress = false;
  signUpSuccess = false;

  constructor(
    private readonly userService: UserService,
    private readonly usernameTakenValidator: UsernameTakenValidator,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onClickSignUp(): void {
    if (!this.form.valid) return;

    this.apiProgress = true;
    this.userService
      .create({
        username: this.username?.value!,
        password: this.password?.value!,
        accountType:
          this.accountType?.value! === 'Owner' ? UserRole.Owner : UserRole.User,
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

  isDisabled() {
    const formFilled =
      this.username?.value &&
      this.password?.value &&
      this.passwordConfirm?.value;

    const validationError =
      this.usernameError || this.passwordError || this.passwordConfirmError;

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
}
