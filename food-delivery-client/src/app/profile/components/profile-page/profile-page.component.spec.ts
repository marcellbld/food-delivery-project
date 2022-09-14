import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  purchasedCart2Mock,
  purchasedCartMock,
} from '../../../../test/mocks/cart.mock';
import { CartService } from '../../../core/services/cart/cart.service';
import { UserService } from '../../../core/services/user/user.service';
import { SharedModule } from '../../../shared/shared.module';
import { PastOrderRowComponent } from '../past-order-row/past-order-row.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserI, UserRole } from '../../../shared/models/user/user.interface';
import { Observable, of } from 'rxjs';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let router: Router;
  let location: Location;

  let authService: AuthService;
  let cartService: CartService;
  let userService: UserService;

  beforeEach(async () => {
    const authServiceMock: Partial<AuthService> = {
      isLoggedIn: jest.fn().mockReturnValueOnce(() => true),
      loggedInUser: jest.fn().mockReturnValue({
        id: 1,
        username: 'user1',
        role: UserRole.User,
        createdAt: new Date('now'),
      }),
    };
    const cartServiceMock: Partial<CartService> = {
      selfPurchasedCarts: [purchasedCartMock, purchasedCart2Mock],
    };

    const userServiceMock: Partial<UserService> = {
      update: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [ProfilePageComponent, PastOrderRowComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
    cartService = TestBed.inject(CartService);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let nativeElement: any;
  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  describe('Layout', () => {
    describe('Base', () => {
      describe('Profile', () => {
        it('has a Profile header', () => {
          const header = nativeElement.querySelector(
            'div[data-testid="header-profile"] span'
          );

          expect(header).toBeTruthy();
          expect(header.textContent).toEqual('Profile');
        });
        it('has Username data row', () => {
          const dataRow = nativeElement.querySelector(
            'div[data-testid="data-row-username"]'
          );

          expect(dataRow).toBeTruthy();
          expect(dataRow.textContent).toContain('Username: ');
        });
        it('has Account Type data row', () => {
          const dataRow = nativeElement.querySelector(
            'div[data-testid="data-row-account-type"]'
          );

          expect(dataRow).toBeTruthy();
          expect(dataRow.textContent).toContain('Account type: ');
        });
      });
      describe('Edit profile', () => {
        it('has a Edit profile header', () => {
          const header = nativeElement.querySelector(
            'div[data-testid="header-edit-profile"] span'
          );

          expect(header).toBeTruthy();
          expect(header.textContent).toEqual('Edit profile');
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
          expect(label?.textContent).toContain('Password Confirmation');
        });

        it('has password type for password input', () => {
          const input = nativeElement.querySelector('input#password');
          expect(input.type).toBe('password');
        });

        it('has password type for passwordConfirm input', () => {
          const input = nativeElement.querySelector('input#passwordConfirm');
          expect(input.type).toBe('password');
        });
        it('has Submit button', () => {
          const button = nativeElement.querySelector('button');
          expect(button).toBeTruthy();
          expect(button.textContent).toEqual('Submit');
        });
        it('should disable Submit button initially', () => {
          const button = nativeElement.querySelector('button');
          expect(button.disabled).toBeTruthy();
        });
      });
      describe('Order history', () => {
        it('has a Order history header', () => {
          const header = nativeElement.querySelector(
            'div[data-testid="header-order-history"] span'
          );

          expect(header).toBeTruthy();
          expect(header.textContent).toEqual('Order history');
        });
      });
    });
    describe('Logged In', () => {
      it('should display Username on Username data row', () => {
        const dataRow = nativeElement.querySelector(
          'div[data-testid="data-row-username"]'
        );

        expect(dataRow).toBeTruthy();
        expect(dataRow.textContent).toContain('user1');
      });
      it('should display Account Type on Account Type data row', () => {
        const dataRow = nativeElement.querySelector(
          'div[data-testid="data-row-account-type"]'
        );

        expect(dataRow).toBeTruthy();
        expect(dataRow.textContent).toContain('USER');
      });
      it('should list purchased carts', () => {
        const pastOrders = nativeElement.querySelectorAll('app-past-order-row');

        expect(pastOrders.length).toBe(2);
      });

      describe('as User', () => {
        it('should assign correct element class on Account Type data row', () => {
          const dataText = nativeElement.querySelector(
            'div[data-testid="data-row-account-type"] span span'
          );

          expect(dataText.classList).toContain('text-primary');
        });
      });
      describe('as Owner', () => {
        beforeEach(() => {
          authService.loggedInUser = jest.fn().mockReturnValue({
            id: 2,
            username: 'owner1',
            role: UserRole.Owner,
            createdAt: new Date('now'),
          });
          fixture.autoDetectChanges();
        });
        it('should assign correct element class on Account Type data row', () => {
          const dataText = nativeElement.querySelector(
            'div[data-testid="data-row-account-type"] span span'
          );

          expect(dataText.classList).toContain('text-orange');
        });
      });
    });
  });
  describe('Interactions', () => {
    describe('Change Password Form', () => {
      let button: any;
      const setupForm = () => {
        const passwordInput = nativeElement.querySelector(
          'input#password'
        ) as HTMLInputElement;
        const passwordConfirmInput = nativeElement.querySelector(
          'input#passwordConfirm'
        ) as HTMLInputElement;

        passwordInput.value = 'pass';
        passwordInput.dispatchEvent(new Event('input'));
        passwordConfirmInput.value = 'pass';
        passwordConfirmInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      };
      it('should enable Submit button when all the fields have valid input', () => {
        setupForm();

        expect(button.disabled).toBeFalsy();
      });
      it('should not enables Submit button when any of the fields have not been filled #1', () => {
        const passwordInput = nativeElement.querySelector(
          'input#password'
        ) as HTMLInputElement;
        const passwordConfirmInput = nativeElement.querySelector(
          'input#passwordConfirm'
        ) as HTMLInputElement;

        passwordInput.value = '';
        passwordInput.dispatchEvent(new Event('input'));
        passwordConfirmInput.value = 'pass';
        passwordConfirmInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        button = nativeElement.querySelector('button');

        expect(button.disabled).toBeTruthy();
      });
      it('should not enables Submit button when any of the fields have not been filled #2', () => {
        const passwordInput = nativeElement.querySelector(
          'input#password'
        ) as HTMLInputElement;
        const passwordConfirmInput = nativeElement.querySelector(
          'input#passwordConfirm'
        ) as HTMLInputElement;

        passwordInput.value = 'pass';
        passwordInput.dispatchEvent(new Event('input'));
        passwordConfirmInput.value = '';
        passwordConfirmInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        button = nativeElement.querySelector('button');

        expect(button.disabled).toBeTruthy();
      });

      it('should call onChangePassword method when click on Submit button', () => {
        const spyObj = jest.spyOn(component, 'onChangePassword');
        spyObj.mockReset();
        setupForm();

        button.click();

        expect(component.onChangePassword).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('Validation', () => {
    const testCases = [
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
  });
  describe('Class', () => {
    describe('onChangePassword', () => {
      it('should call userService.update with correct params when form is valid', () => {
        const spyObj = jest.spyOn(userService, 'update');
        spyObj.mockReset();
        userService.update = jest
          .fn()
          .mockImplementationOnce((_: string): Observable<UserI> => {
            return of({});
          });

        component.password?.setValue('pass');
        component.passwordConfirm?.setValue('pass');

        component.onChangePassword();

        expect(userService.update).toHaveBeenCalledWith('pass');
      });
      it('should not call userService.update when form is invalid', () => {
        const spyObj = jest.spyOn(userService, 'update');
        spyObj.mockReset();
        userService.update = jest
          .fn()
          .mockImplementationOnce((_: string): Observable<UserI> => {
            return of({});
          });

        component.password?.setValue('pass');
        component.passwordConfirm?.setValue('');

        component.onChangePassword();

        expect(userService.update).not.toHaveBeenCalled();
      });
    });
  });
});
