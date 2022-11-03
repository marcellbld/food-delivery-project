import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HomePageComponent } from '../../../home/components/home-page/home-page.component';
import { LoginPageComponent } from '../../../login/components/login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page.component';
import { UserService } from '../../../core/services/user/user.service';
import { MapAddressService } from '../../../core/services/map-address/map-address.service';
import { MapService } from '../../../core/services/map/map.service';

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;

  let userService: UserService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const userServiceMock = {
      findById: jest.fn(),
      create: jest.fn(),
      isUsernameTaken: jest.fn(),
    } as Partial<UserService>;

    const mapAddressServiceMock = {} as Partial<MapAddressService>;
    const mapServiceMock = {} as Partial<MapService>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomePageComponent },
          { path: 'login', component: LoginPageComponent },
          { path: 'registration', component: RegistrationPageComponent },
        ]),
        SharedModule,
      ],
      declarations: [RegistrationPageComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MapAddressService, useValue: mapAddressServiceMock },
        { provide: MapService, useValue: mapServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RegistrationPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  let nativeElement: any;

  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });
  describe('Layout', () => {
    describe('Base', () => {
      it('has Registration Header', async () => {
        const registration = nativeElement.querySelector(
          'span.fs-1'
        ) as HTMLElement;
        expect(registration.textContent).toBe('Registration');
      });
      it('has username input', () => {
        const label = nativeElement.querySelector('label[for="username"]');
        const input = nativeElement.querySelector('input#username');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Username');
      });
      it('has password input', () => {
        const label = nativeElement.querySelector('label[for="password"]');
        const input = nativeElement.querySelector('input#password');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Password');
      });
      it('has passwordConfirm input', () => {
        const label = nativeElement.querySelector(
          'label[for="passwordConfirm"]'
        );
        const input = nativeElement.querySelector('input#passwordConfirm');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Password confirmation');
      });
      it('has password type for password input', () => {
        const input = nativeElement.querySelector('input#password');
        expect(input.type).toBe('password');
      });
      it('has password type for passwordConfirm input', () => {
        const input = nativeElement.querySelector('input#passwordConfirm');
        expect(input.type).toBe('password');
      });
      it('has radio buttons for AccountType', () => {
        const label1 = nativeElement.querySelector(
          'label[for="account-type-radio-1"]'
        );
        const label2 = nativeElement.querySelector(
          'label[for="account-type-radio-2"]'
        );
        const input1 = nativeElement.querySelector(
          'input#account-type-radio-1'
        );
        const input2 = nativeElement.querySelector(
          'input#account-type-radio-2'
        );
        expect(input1).toBeTruthy();
        expect(input2).toBeTruthy();
        expect(label1).toBeTruthy();
        expect(label2).toBeTruthy();
        expect(label1?.textContent).toContain('User');
        expect(label2?.textContent).toContain('Owner');
      });
      it('should check User radio button initially', () => {
        const input = nativeElement.querySelector('input#account-type-radio-1');
        expect(input.checked).toBeTruthy();
      });
      it('should not check Owner radio button initially', () => {
        const input = nativeElement.querySelector('input#account-type-radio-2');
        expect(input.checked).toBeFalsy();
      });
      it('should disable the Sign Up button initially', () => {
        const button = nativeElement.querySelector('button');
        expect(button?.disabled).toBeTruthy();
      });
    });
  });
  describe('Interactions', () => {
    describe('Valid input', () => {
      let button: any;

      beforeEach(() => {
        userService.isUsernameTaken = jest
          .fn()
          .mockImplementationOnce((_: string) => {
            return of(false);
          });

        const usernameInput = nativeElement.querySelector(
          'input#username'
        ) as HTMLInputElement;
        const passwordInput = nativeElement.querySelector(
          'input#password'
        ) as HTMLInputElement;
        const passwordConfirmInput = nativeElement.querySelector(
          'input#passwordConfirm'
        ) as HTMLInputElement;

        usernameInput.value = 'user1';
        usernameInput.dispatchEvent(new Event('input'));
        usernameInput.dispatchEvent(new Event('blur'));
        passwordInput.value = 'password';
        passwordInput.dispatchEvent(new Event('input'));
        passwordConfirmInput.value = 'password';
        passwordConfirmInput.dispatchEvent(new Event('input'));

        component.location = [1, 1];

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      });
      it('should enables the button', async () => {
        expect(button?.disabled).toBeFalsy();
      });
      it('should call onClickSignUp', async () => {
        const spyObj = jest.spyOn(component, 'onClickSignUp');
        spyObj.mockReset();

        button.click();
        fixture.detectChanges();
        expect(component.onClickSignUp).toHaveBeenCalled();
      });
    });
    describe('Invalid input', () => {
      let button: any;

      beforeEach(() => {
        userService.isUsernameTaken = jest
          .fn()
          .mockImplementationOnce((_: string) => {
            return of(true);
          });

        const usernameInput = nativeElement.querySelector(
          'input#username'
        ) as HTMLInputElement;
        const passwordInput = nativeElement.querySelector(
          'input#password'
        ) as HTMLInputElement;
        const passwordConfirmInput = nativeElement.querySelector(
          'input#passwordConfirm'
        ) as HTMLInputElement;

        usernameInput.value = 'user1';
        usernameInput.dispatchEvent(new Event('input'));
        usernameInput.dispatchEvent(new Event('blur'));
        passwordInput.value = 'password';
        passwordInput.dispatchEvent(new Event('input'));
        passwordConfirmInput.value = 'password';
        passwordConfirmInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      });
      it('should disables the submit button', async () => {
        expect(button?.disabled).toBeTruthy();
      });
      it('should not call onClickSignUp', async () => {
        const spyObj = jest.spyOn(component, 'onClickSignUp');
        spyObj.mockReset();

        button.click();
        fixture.detectChanges();
        expect(component.onClickSignUp).not.toHaveBeenCalled();
      });
    });

    it('should change radio button', () => {
      const input = nativeElement.querySelector('input#account-type-radio-1');
      const input2 = nativeElement.querySelector('input#account-type-radio-2');
      expect(input.checked).toBeTruthy();
      expect(input2.checked).toBeFalsy();

      input2.click();
      fixture.detectChanges();

      expect(input.checked).toBeFalsy();
      expect(input2.checked).toBeTruthy();
    });
  });
  describe('Validation', () => {
    const testCases = [
      { field: 'username', value: '', error: 'Username is required' },
      {
        field: 'username',
        value: '123',
        error: 'Username must be between 4 and 20 characters long',
      },
      {
        field: 'username',
        value: '123456789012345678901',
        error: 'Username must be between 4 and 20 characters long',
      },
      { field: 'password', value: '', error: 'Password is required' },
      {
        field: 'password',
        value: '123',
        error: 'Password must be between 4 and 20 characters long',
      },
      {
        field: 'password',
        value: '123456789012345678901',
        error: 'Password must be between 4 and 20 characters long',
      },
      {
        field: 'passwordConfirm',
        value: 'pass',
        error: 'Password mismatch',
      },
    ];

    testCases.forEach(({ field, value, error }) => {
      it(`displays ${error} when ${field} has '${value}'`, () => {
        const signUp = fixture.nativeElement as HTMLElement;
        expect(
          signUp.querySelector(`div[data-testid="${field}-validation"]`)
        ).toBeNull();
        const input = signUp.querySelector(
          `input#${field}`
        ) as HTMLInputElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const validationElement = signUp.querySelector(
          `div[data-testid="${field}-validation"]`
        );
        expect(validationElement?.textContent).toContain(error);
      });
    });

    it('should display "Username is already taken." when username is not unique', () => {
      userService.isUsernameTaken = jest
        .fn()
        .mockImplementationOnce((_: string) => {
          return of(true);
        });

      const usernameInput = nativeElement.querySelector(
        'input#username'
      ) as HTMLInputElement;

      usernameInput.value = 'user1';
      usernameInput.dispatchEvent(new Event('input'));
      usernameInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const validationErrorElement = nativeElement.querySelector(
        `div[data-testid="username-validation"]`
      );
      expect(validationErrorElement.textContent).toEqual(
        ' Username is already taken. '
      );
    });
  });
  describe('Class', () => {
    describe('onClickSignUp', () => {
      it('should call userService.create when form is valid', () => {
        userService.isUsernameTaken = jest
          .fn()
          .mockImplementationOnce((_: string) => {
            return of(false);
          });
        userService.create = jest.fn().mockImplementationOnce(() => of(true));

        component.form.get('username')?.setValue('user1');
        component.form.get('password')?.setValue('pass');
        component.form.get('passwordConfirm')?.setValue('pass');

        component.location = [1, 1];

        component.onClickSignUp();

        expect(userService.create).toHaveBeenCalledTimes(1);
      });
      it('should not call userService.create when form is invalid', async () => {
        component.onClickSignUp();

        expect(userService.create).not.toHaveBeenCalled();
      });
      it('should navigate to Home Page when registration was success', async () => {
        userService.isUsernameTaken = jest
          .fn()
          .mockImplementationOnce((_: string) => {
            return of(false);
          });
        userService.create = jest.fn().mockImplementationOnce(() => of(true));

        component.form.get('username')?.setValue('user1');
        component.form.get('password')?.setValue('pass');
        component.form.get('passwordConfirm')?.setValue('pass');

        component.location = [1, 1];

        component.onClickSignUp();

        expect(location.path()).toEqual('');
      });
    });
  });
});
