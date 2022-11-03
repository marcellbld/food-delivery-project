import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../core/services/user/user.service';
import { HomePageComponent } from '../../../home/components/home-page/home-page.component';
import { LoginPageComponent } from '../../../login/components/login-page/login-page.component';
import { RegistrationPageComponent } from '../../../registration/components/registration-page/registration-page.component';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { CreateRestaurantItemPageComponent } from './create-restaurant-item-page.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { restaurantMock } from '../../../../test/mocks/restaurant.mock';
import { userMock } from '../../../../test/mocks/user.mock';
import { RestaurantPageComponent } from '../restaurant-page/restaurant-page.component';
import { RestaurantItemService } from '../../../core/services/restaurant-item/restaurant-item.service';
import { restaurantItem1Mock } from '../../../../test/mocks/restaurant-item.mock';

describe('CreateRestaurantItemPageComponent', () => {
  let component: CreateRestaurantItemPageComponent;
  let fixture: ComponentFixture<CreateRestaurantItemPageComponent>;

  let restaurantItemService: RestaurantItemService;
  let restaurantService: RestaurantService;
  let authService: AuthService;
  let userService: UserService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        params: {
          id: 1,
        },
      },
    };
    const restaurantServiceMock = {
      findSelf: jest.fn().mockReturnValue(of([restaurantMock])),
    } as Partial<RestaurantService>;
    const restaurantItemServiceMock = {
      create: jest.fn().mockReturnValue(of(restaurantItem1Mock)),
    } as Partial<RestaurantItemService>;

    const authServiceMock = {
      loggedInUser: jest.fn().mockReturnValue(userMock),
    } as Partial<AuthService>;
    const userServiceMock = {} as Partial<UserService>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomePageComponent },
          { path: 'login', component: LoginPageComponent },
          { path: 'registration', component: RegistrationPageComponent },
          { path: 'restaurants/:id', component: RestaurantPageComponent },
        ]),
        SharedModule,
        NgSelectModule,
      ],
      declarations: [CreateRestaurantItemPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: RestaurantItemService, useValue: restaurantItemServiceMock },
        { provide: RestaurantService, useValue: restaurantServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    restaurantItemService = TestBed.inject(RestaurantItemService);
    restaurantService = TestBed.inject(RestaurantService);
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(CreateRestaurantItemPageComponent);
    component = fixture.componentInstance;

    component.window = { history: { state: {} } };

    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CreateRestaurantItemPageComponent);
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
      it('has Create item Header', async () => {
        const header = nativeElement.querySelector('span.fs-1') as HTMLElement;
        expect(header.textContent).toBe('Create item');
      });
      it('has name input', () => {
        const label = nativeElement.querySelector('label[for="itemName"]');
        const input = nativeElement.querySelector('input#itemName');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Name');
      });
      it('has description textarea', () => {
        const label = nativeElement.querySelector('label[for="description"]');
        const textarea = nativeElement.querySelector('textarea#description');
        expect(textarea).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Description');
      });
      it('has price input', () => {
        const label = nativeElement.querySelector('label[for="price"]');
        const input = nativeElement.querySelector('input#price');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Price');
      });
      it('has file input', () => {
        const label = nativeElement.querySelector('label[for="file"]');
        const input = nativeElement.querySelector('input#file');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Main Image');
      });
      it('has Create button', () => {
        const button = nativeElement.querySelector('button');
        expect(button).toBeTruthy();
        expect(button?.textContent).toContain('Create');
      });
      it('should disable the Create button initially', () => {
        const button = nativeElement.querySelector('button');

        expect(button?.disabled).toBeTruthy();
      });
    });
  });
  describe('Interactions', () => {
    describe('Valid input', () => {
      let button: any;
      beforeEach(fakeAsync(() => {
        const nameInput = nativeElement.querySelector(
          'input#itemName'
        ) as HTMLInputElement;
        const descriptionTextarea = nativeElement.querySelector(
          'textarea#description'
        ) as HTMLInputElement;
        const priceInput = nativeElement.querySelector(
          'input#price'
        ) as HTMLInputElement;

        nameInput.value = 'New Item Name';
        nameInput.dispatchEvent(new Event('input'));
        nameInput.dispatchEvent(new Event('blur'));
        descriptionTextarea.value = 'Item Description';
        descriptionTextarea.dispatchEvent(new Event('input'));

        priceInput.value = '12.56';
        priceInput.dispatchEvent(new Event('input'));
        priceInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      }));
      it('should enables the button', () => {
        expect(button?.disabled).toBeFalsy();
      });
      it('should call onClickCreate when click the Create button', () => {
        jest.spyOn(component, 'onClickSubmit');

        button.click();
        expect(component.onClickSubmit).toHaveBeenCalled();
      });
    });
    describe('Invalid input', () => {
      let button: any;
      beforeEach(fakeAsync(() => {
        const nameInput = nativeElement.querySelector(
          'input#itemName'
        ) as HTMLInputElement;
        const descriptionTextarea = nativeElement.querySelector(
          'textarea#description'
        ) as HTMLInputElement;
        const priceInput = nativeElement.querySelector(
          'input#price'
        ) as HTMLInputElement;

        nameInput.value = '';
        nameInput.dispatchEvent(new Event('input'));
        nameInput.dispatchEvent(new Event('blur'));
        descriptionTextarea.value = 'Item Description';
        descriptionTextarea.dispatchEvent(new Event('input'));

        priceInput.value = '12.56';
        priceInput.dispatchEvent(new Event('input'));
        priceInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      }));
      it('should disables the button', () => {
        expect(button?.disabled).toBeTruthy();
      });
      it('should not call onClickCreate when click the Create button', () => {
        jest.spyOn(component, 'onClickSubmit');

        button.click();
        expect(component.onClickSubmit).not.toHaveBeenCalled();
      });
    });
  });
  describe('Validation', () => {
    const inputTestCases = [
      { field: 'itemName', value: '', error: 'Name is required' },
      {
        field: 'itemName',
        value: '12',
        error: 'Name must be between 3 and 30 characters long',
      },
      {
        field: 'itemName',
        value: '1234567890123456789012345678901',
        error: 'Name must be between 3 and 30 characters long',
      },
      {
        field: 'price',
        value: '',
        error: 'Price is required',
      },
      {
        field: 'price',
        value: 'aaa',
        error: 'Price is required',
      },
    ];

    inputTestCases.forEach(({ field, value, error }) => {
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
    const textareaTestCases = [
      {
        field: 'description',
        value: '1234567890123456789012345678901'.repeat(3),
        error: 'Description must be maximum 50 characters long',
      },
    ];

    textareaTestCases.forEach(({ field, value, error }) => {
      it(`displays ${error} when ${field} has '${value}'`, () => {
        const signUp = fixture.nativeElement as HTMLElement;
        expect(
          signUp.querySelector(`div[data-testid="${field}-validation"]`)
        ).toBeNull();
        const textarea = signUp.querySelector(
          `textarea#${field}`
        ) as HTMLInputElement;
        textarea.value = value;
        textarea.dispatchEvent(new Event('input'));
        textarea.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const validationElement = signUp.querySelector(
          `div[data-testid="${field}-validation"]`
        );
        expect(validationElement?.textContent).toContain(error);
      });
    });
    describe('Class', () => {
      describe('onClickCreate', () => {
        it('should call restaurantItemService.create with correct params when form is valid', fakeAsync(() => {
          component.form.get('itemName')?.setValue('New Item Name');
          component.form.get('description')?.setValue('Item Description');
          component.form.get('price')?.setValue('12.34');

          component.onClickSubmit();

          expect(restaurantItemService.create).toHaveBeenCalledWith({
            name: 'New Item Name',
            description: 'Item Description',
            restaurant: restaurantMock.id,
            price: 12.34,
            file: undefined,
          });
        }));
        it('should not call restaurantItemService.create when form is invalid', async () => {
          component.onClickSubmit();

          expect(restaurantItemService.create).not.toHaveBeenCalled();
        });
        it('should navigate to Restaurant Page when creation was success', fakeAsync(() => {
          component.form.get('itemName')?.setValue('New Item Name');
          component.form.get('description')?.setValue('Item Description');
          component.form.get('price')?.setValue('12.34');

          component.onClickSubmit();

          fixture.detectChanges();
          tick();

          expect(location.path()).toEqual(`/restaurants/${restaurantMock.id}`);
        }));
      });
    });
  });
});
