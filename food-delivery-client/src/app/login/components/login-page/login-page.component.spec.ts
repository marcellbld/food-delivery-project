import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { SharedModule } from '../../../shared/shared.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationPageComponent } from '../../../registration/components/registration-page/registration-page.component';
import { HomePageComponent } from '../../../home/components/home-page/home-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authService: any;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
    } as Partial<AuthService>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomePageComponent },
          { path: 'login', component: LoginPageComponent },
          { path: 'registration', component: RegistrationPageComponent },
        ]),
        SharedModule,
      ],
      declarations: [LoginPageComponent],
      providers: [
        { provide: JwtHelperService, useValue: {} },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  let loginNE: any;

  beforeEach(() => {
    loginNE = fixture.nativeElement as HTMLElement;
  });

  describe('Layout', () => {
    it('has Login Header', async () => {
      const login = loginNE.querySelector('span.fs-1') as HTMLElement;
      expect(login.textContent).toBe('Login');
    });

    it('has username input', () => {
      const label = loginNE.querySelector('label[for="username"]');
      const input = loginNE.querySelector('input#username');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Username');
    });
    it('has password input', () => {
      const label = loginNE.querySelector('label[for="password"]');
      const input = loginNE.querySelector('input#password');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Password');
    });

    it('has password type for password input', () => {
      const input = loginNE.querySelector('input#password');
      expect(input.type).toBe('password');
    });

    it('has Login button', () => {
      const button = loginNE.querySelector('button');
      expect(button?.textContent).toContain('Login');
    });

    it('should disable the Login button initially', () => {
      const button = loginNE.querySelector('button');
      expect(button?.disabled).toBeTruthy();
    });
  });
  describe('Interactions', () => {
    let button: any;

    const setupForm = async () => {
      const usernameInput = loginNE.querySelector(
        'input#username'
      ) as HTMLInputElement;
      const passwordInput = loginNE.querySelector(
        'input#password'
      ) as HTMLInputElement;

      usernameInput.value = 'user1';
      usernameInput.dispatchEvent(new Event('input'));
      passwordInput.value = 'password';
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button = loginNE.querySelector('button');
    };

    it('should enables the button when all the fields have valid input', async () => {
      await setupForm();

      expect(button?.disabled).toBeFalsy();
    });
    it('should not enables the button when any of the fields have not been filled #1', async () => {
      const passwordInput = loginNE.querySelector(
        'input#password'
      ) as HTMLInputElement;

      passwordInput.value = 'password';
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button = loginNE.querySelector('button');

      expect(button?.disabled).toBeTruthy();
    });
    it('should not enables the button when any of the fields have not been filled #2', async () => {
      const usernameInput = loginNE.querySelector(
        'input#username'
      ) as HTMLInputElement;

      usernameInput.value = 'user1';
      usernameInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button = loginNE.querySelector('button');

      expect(button?.disabled).toBeTruthy();
    });
    it('should display error message coming from backend after login failure', async () => {
      authService.login.mockReturnValue(
        throwError({
          error: {
            message: 'Login failed. Incorrect username or password.',
          },
        })
      );

      await setupForm();
      button.click();

      fixture.detectChanges();

      const errorElement = loginNE.querySelector(
        `div[data-testid="login-error"]`
      );

      expect(errorElement?.textContent).toContain(
        'Login failed. Incorrect username or password.'
      );
    });
  });
  describe('Class', () => {
    describe('onClickLogin', () => {
      it('should call authService.login when form is valid', async () => {
        authService.login.mockReturnValue(of(true));

        component.form.get('username')?.setValue('user1');
        component.form.get('password')?.setValue('pass');

        component.onClickLogin();

        expect(authService.login).toHaveBeenCalled();
      });
      it('should not call authService.login when form is invalid', async () => {
        component.onClickLogin();

        expect(authService.login).not.toHaveBeenCalled();
      });
      it('should navigate to Home Page when login was success', async () => {
        authService.login.mockReturnValue(of(true));

        component.form.get('username')?.setValue('user1');
        component.form.get('password')?.setValue('pass');

        component.onClickLogin();

        expect(location.path()).toEqual('');
      });
    });
  });
});
