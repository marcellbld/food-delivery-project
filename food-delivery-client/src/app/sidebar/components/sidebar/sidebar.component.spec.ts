import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { HomePageComponent } from '../../../home/components/home-page/home-page.component';
import { LoginPageComponent } from '../../../login/components/login-page/login-page.component';
import { SharedModule } from '../../../shared/shared.module';
import { SidebarComponent } from './sidebar.component';
import { UserRole } from '../../../shared/models/user/user.interface';
import { cartMock } from '../../../../test/mocks/cart.mock';
import { RestaurantPageComponent } from '../../../restaurants/components/restaurant-page/restaurant-page.component';
import { RegistrationPageComponent } from '../../../registration/components/registration-page/registration-page.component';
import { ProfilePageComponent } from '../../../profile/components/profile-page/profile-page.component';
import { Cart } from '../../../shared/models/cart/cart';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let location: Location;

  let authService: any;
  let cartService: any;

  beforeEach(async () => {
    const authServiceMock = {
      loginChange$: of(true),
      isLoggedIn: jest.fn(),
      loggedInUser: jest.fn(),
      logout: jest.fn(),
      deleteSelfCart: jest.fn(),
      cart: jest.fn(),
    } as unknown as Partial<AuthService>;
    const cartServiceMock = {
      selfActiveCart: {
        calculateTotalCost: jest.fn(),
      } as Partial<Cart>,
      deleteSelfCart: jest.fn(),
      checkoutCart: jest.fn(),
    } as Partial<CartService>;

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: HomePageComponent },
          { path: 'login', component: LoginPageComponent },
          { path: 'profile', component: ProfilePageComponent },
          { path: 'registration', component: RegistrationPageComponent },
          { path: 'restaurants/:id', component: RestaurantPageComponent },
        ]),
        SharedModule,
      ],
      declarations: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartService, useValue: cartServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
    cartService = TestBed.inject(CartService);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let nativeElement: any;
  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  beforeEach(() => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.loggedInUser.mockReturnValue({
      id: 1,
      username: 'user1',
      role: UserRole.User,
      createdAt: new Date('now'),
    });
    cartService.selfActiveCart = cartMock;
    cartService.selfActiveCart.calculateTotalCost = jest
      .fn()
      .mockReturnValue(12.5);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  describe('Layout', () => {
    describe('Base', () => {
      it('has Profile header with icon and text', () => {
        const header = nativeElement.querySelector(
          'h5[data-testid="header-profile"]'
        );
        const icon = header.querySelector('i');
        const span = header.querySelector('span');
        expect(icon).toBeTruthy();
        expect(span.textContent).toEqual('Profile');
      });
      it('has Cart header with icon and text', () => {
        const header = nativeElement.querySelector(
          'h5[data-testid="header-cart"]'
        );
        const icon = header.querySelector('i');
        const span = header.querySelector('span');
        expect(icon).toBeTruthy();
        expect(span.textContent).toEqual('Cart');
      });
      it('has Checkout header with icon and text', () => {
        const header = nativeElement.querySelector(
          'h5[data-testid="header-checkout"]'
        );
        const icon = header.querySelector('i');
        const span = header.querySelector('span');
        expect(icon).toBeTruthy();
        expect(span.textContent).toEqual('Checkout');
      });
      it('has Close button', () => {
        const button = nativeElement.querySelector('button.btn-close');
        expect(button).toBeTruthy();
      });
      it('has Cart Delete button', () => {
        const button = nativeElement.querySelector(
          'button[data-testid="cart-delete-btn"]'
        );
        expect(button).toBeTruthy();
      });
      it('has Checkout button', () => {
        const button = nativeElement.querySelector(
          'button[data-testid="checkout-btn"]'
        );
        expect(button).toBeTruthy();
      });
      it('has Total Cost text with correct prefix text', () => {
        const text = nativeElement.querySelector(
          'h6[data-testid="total-cost-text"]'
        );
        expect(text.textContent).toContain('Total: ');
      });
      it('has Logged in text with correct prefix text', () => {
        const text = nativeElement.querySelector(
          'span[data-testid="logged-in-text"]'
        );
        expect(text.textContent).toContain('Logged in as ');
      });
    });
    describe('Logged In', () => {
      it('should display username', () => {
        const text = nativeElement.querySelector(
          'span[data-testid="logged-in-text"] span'
        );

        expect(text.textContent).toContain('user1');
      });
      it('has Edit Profile button', () => {
        const button = nativeElement.querySelector(
          'button[data-testid="edit-profile-button"]'
        );

        expect(button).toBeTruthy();
      });
      it('has Logout button', () => {
        const button = nativeElement.querySelector(
          'button[data-testid="logout-button"]'
        );

        expect(button).toBeTruthy();
      });
      describe('Has Cart', () => {
        it('has link to correct restaurant', () => {
          const link = nativeElement.querySelector(
            'a[data-testid="cart-restaurant-link"]'
          );
          const span = link.querySelector('span');
          expect(span.textContent).toEqual('Test Restaurant');
        });
        it('should display all cart items', () => {
          const items = nativeElement.querySelectorAll('app-cart-item-block');
          expect(items.length).toBe(2);
        });
        it('should display cart total cost', () => {
          const totalCost = nativeElement.querySelector(
            'h6[data-testid="total-cost-text"] span'
          );

          expect(totalCost.textContent).toEqual('$12.50');
        });
        it('should enable Delete Cart button', () => {
          const button = nativeElement.querySelector(
            'button[data-testid="cart-delete-btn"]'
          ) as HTMLButtonElement;

          expect(button.disabled).toBeFalsy();
        });
        it('should enable Checkout button', () => {
          const button = nativeElement.querySelector(
            'button[data-testid="checkout-btn"]'
          );
          expect(button.disabled).toBeFalsy();
        });
      });
      describe('No Cart', () => {
        beforeEach(() => {
          cartService.selfActiveCart = undefined;
          fixture.detectChanges();
        });
        it('should not display restaurant link', () => {
          const link = nativeElement.querySelector(
            'a[data-testid="cart-restaurant-link"]'
          );
          expect(link).toBeFalsy();
        });
        it('should not display any cart items', () => {
          const items = nativeElement.querySelectorAll('app-cart-item-block');
          expect(items.length).toBe(0);
        });
        it('should set cart total cost to 0', () => {
          const totalCost = nativeElement.querySelector(
            'h6[data-testid="total-cost-text"] span'
          );
          expect(totalCost.textContent).toEqual('$0.00');
        });
        it('should disable Delete Cart button', () => {
          const button = nativeElement.querySelector(
            'button[data-testid="cart-delete-btn"]'
          ) as HTMLButtonElement;

          expect(button.disabled).toBeTruthy();
        });
        it('should disable Checkout button', () => {
          const button = nativeElement.querySelector(
            'button[data-testid="checkout-btn"]'
          );
          expect(button.disabled).toBeTruthy();
        });
      });
    });
  });
  describe('Interaction', () => {
    describe('Delete Cart Button', () => {
      beforeEach(() => {
        cartService.deleteSelfCart = jest
          .fn()
          .mockImplementationOnce((_: number): Observable<boolean> => {
            cartService.selfActiveCart = undefined;
            return of(true);
          });
      });
      it('should call clickOnDeleteButton when click on Delete Cart button', () => {
        jest.spyOn(component, 'clickOnDeleteButton');

        const button = nativeElement.querySelector(
          'button[data-testid="cart-delete-btn"]'
        );

        button.click();
        fixture.detectChanges();

        expect(component.clickOnDeleteButton).toHaveBeenCalled();
      });
      it('should remove existing cart items when click', () => {
        const button = nativeElement.querySelector(
          'button[data-testid="cart-delete-btn"]'
        );

        button.click();
        fixture.detectChanges();

        const items = nativeElement.querySelectorAll('app-cart-item-block');
        expect(items.length).toBe(0);
      });
    });
    describe('Restaurant link', () => {
      it('should navigate to correct restaurant when click from outside of restaurant page', fakeAsync(() => {
        router.navigate(['']);
        tick();
        const link = nativeElement.querySelector(
          'a[data-testid="cart-restaurant-link"]'
        ) as HTMLAnchorElement;

        link.click();
        tick();

        expect(location.path()).toEqual('/restaurants/1');
      }));
    });
    describe('Edit Profile button', () => {
      it('should navigate to profile when click from outside of profile page', fakeAsync(() => {
        router.navigate(['']);
        tick();
        const button = nativeElement.querySelector(
          'button[data-testid="edit-profile-button"]'
        ) as HTMLButtonElement;

        button.click();
        tick();

        expect(location.path()).toEqual('/profile');
      }));
    });
    describe('Logout button', () => {
      it('should call clickLogOutButton method', fakeAsync(() => {
        const spyObj = jest.spyOn(component, 'clickLogOutButton');
        spyObj.mockReset();

        const button = nativeElement.querySelector(
          'button[data-testid="logout-button"]'
        ) as HTMLButtonElement;

        button.click();
        tick();

        expect(component.clickLogOutButton).toHaveBeenCalledTimes(1);
      }));
    });
  });
  describe('Class', () => {
    describe('isLoggedIn', () => {
      it('should call authService.isLoggedIn', () => {
        const spyObj = jest.spyOn(authService, 'isLoggedIn');
        spyObj.mockReset();

        component.isLoggedIn;

        expect(authService.isLoggedIn).toHaveBeenCalled();
      });

      it('should return true', () => {
        expect(component.isLoggedIn).toBeTruthy();
      });
    });
    describe('loggedInUsername', () => {
      it('should call authService.loggedInUser', () => {
        const spyObj = jest.spyOn(authService, 'loggedInUser');
        spyObj.mockReset();

        component.loggedInUsername;

        expect(authService.loggedInUser).toHaveBeenCalled();
      });

      it('should return correct username', () => {
        expect(component.loggedInUsername).toEqual('user1');
      });
    });
    describe('get cart', () => {
      describe('Has Cart', () => {
        it('should return cart', () => {
          const cart = component.cart;

          expect(cart).toBeTruthy();
        });
      });
      describe('No Cart', () => {
        beforeEach(() => {
          cartService.selfActiveCart = undefined;
        });
        it('should return undefined', () => {
          const cart = component.cart;

          expect(cart).toBeFalsy();
        });
      });
    });
    describe('isCartEmpty', () => {
      describe('Has Cart', () => {
        it('should return false', () => {
          const result = component.isCartEmpty();

          expect(result).toBeFalsy();
        });
      });
      describe('No Cart', () => {
        beforeEach(() => {
          cartService.selfActiveCart = undefined;
        });
        it('should return true', () => {
          const result = component.isCartEmpty();

          expect(result).toBeTruthy();
        });
      });
    });
    describe('getTotalCost', () => {
      it('should call cartService.selfActiveCart.calculateTotalCost()', () => {
        const spyObj = jest.spyOn(
          cartService.selfActiveCart,
          'calculateTotalCost'
        );
        spyObj.mockReset();

        component.getTotalCost();

        expect(
          cartService.selfActiveCart.calculateTotalCost
        ).toHaveBeenCalled();
      });
      it('should return totalCost', () => {
        cartService.selfActiveCart.calculateTotalCost.mockReturnValue(15.5);

        const totalCost = component.getTotalCost();

        expect(totalCost).toEqual(15.5);
      });
    });
    describe('clickLogOutButton', () => {
      it('should call authService.logout', () => {
        const spyObj = jest.spyOn(authService, 'logout');
        spyObj.mockReset();

        component.clickLogOutButton();

        expect(authService.logout).toHaveBeenCalled();
      });
    });
    describe('clickOnDeleteButton', () => {
      it('should call cartService.deleteSelfCart with correct params', () => {
        const spyObj = jest.spyOn(cartService, 'deleteSelfCart');
        spyObj.mockReset();
        cartService.deleteSelfCart = jest
          .fn()
          .mockImplementationOnce((_: number): Observable<boolean> => {
            cartService.selfActiveCart = undefined;
            return of(true);
          });

        component.clickOnDeleteButton();

        expect(cartService.deleteSelfCart).toHaveBeenCalledWith(1);
      });
    });
    describe('clickOnCheckoutButton', () => {
      it('should call cartService.checkoutCart', () => {
        const spyObj = jest.spyOn(cartService, 'checkoutCart');
        spyObj.mockReset();
        cartService.checkoutCart = jest
          .fn()
          .mockImplementationOnce((_: number): Observable<boolean> => {
            cartService.selfActiveCart = undefined;
            return of(true);
          });

        component.clickOnCheckoutButton();

        expect(cartService.checkoutCart).toHaveBeenCalledTimes(1);
      });
    });
  });
});
