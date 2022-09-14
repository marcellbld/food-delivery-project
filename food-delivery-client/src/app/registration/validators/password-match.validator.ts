import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');
  if (password?.value === passwordConfirm?.value) return null;

  return {
    passwordMatch: true,
  };
};
