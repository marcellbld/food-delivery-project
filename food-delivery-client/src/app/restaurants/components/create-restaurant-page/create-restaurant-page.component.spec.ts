import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../core/services/user/user.service';
import { HomePageComponent } from '../../../home/components/home-page/home-page.component';
import { LoginPageComponent } from '../../../login/components/login-page/login-page.component';
import { RegistrationPageComponent } from '../../../registration/components/registration-page/registration-page.component';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { CreateRestaurantPageComponent } from './create-restaurant-page.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { of } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  primaryCategory1Mock,
  primaryCategory2Mock,
} from '../../../../test/mocks/category.mock';
import {
  getNgSelectElement,
  triggerKeyDownEvent,
  KeyCode,
  selectOption,
} from '../../../../test/ng-select-helper';
import { restaurantMock } from '../../../../test/mocks/restaurant.mock';
import { userMock } from '../../../../test/mocks/user.mock';
import { RestaurantPageComponent } from '../restaurant-page/restaurant-page.component';

describe('CreateRestaurantPageComponent', () => {
  let component: CreateRestaurantPageComponent;
  let fixture: ComponentFixture<CreateRestaurantPageComponent>;

  let restaurantService: RestaurantService;
  let authService: AuthService;
  let userService: UserService;
  let categoryService: CategoryService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const restaurantServiceMock = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn().mockReturnValue(of(restaurantMock)),
      isRestaurantNameTaken: jest.fn(),
    } as Partial<RestaurantService>;

    const authServiceMock = {
      loggedInUser: jest.fn().mockReturnValue(userMock),
    } as Partial<AuthService>;
    const userServiceMock = {} as Partial<UserService>;
    const categoryServiceMock = {
      findPrimaries: jest
        .fn()
        .mockReturnValue(of([primaryCategory1Mock, primaryCategory2Mock])),
    } as Partial<CategoryService>;

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
      declarations: [CreateRestaurantPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: RestaurantService, useValue: restaurantServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    restaurantService = TestBed.inject(RestaurantService);
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
    fixture = TestBed.createComponent(CreateRestaurantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CreateRestaurantPageComponent);
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
      it('has Create restaurant Header', async () => {
        const header = nativeElement.querySelector('span.fs-1') as HTMLElement;
        expect(header.textContent).toBe('Create restaurant');
      });
      it('has name input', () => {
        const label = nativeElement.querySelector(
          'label[for="restaurantName"]'
        );
        const input = nativeElement.querySelector('input#restaurantName');
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
      it('has categories ng-select', () => {
        const label = nativeElement.querySelector('label[for="categories"]');
        const ngSelect = nativeElement.querySelector('ng-select#categories');
        expect(ngSelect).toBeTruthy();
        expect(label).toBeTruthy();
        expect(label?.textContent).toContain('Categories');
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
        console.log(button);

        expect(button?.disabled).toBeTruthy();
      });
    });
  });
  describe('Interactions', () => {
    describe('Category selection', () => {
      it('should display categories when click on ngSelect', fakeAsync(() => {
        const ngSelect = getNgSelectElement(fixture);

        triggerKeyDownEvent(ngSelect, KeyCode.Space);
        fixture.detectChanges();
        tick();
        discardPeriodicTasks();

        const options = nativeElement.querySelectorAll('.ng-option span');

        expect(options.length).toBe(2);
        expect(options[0].textContent).toEqual('Primary 1');
        expect(options[1].textContent).toEqual('Primary 2');
      }));
    });
    describe('Valid input', () => {
      let button: any;
      beforeEach(fakeAsync(() => {
        restaurantService.isRestaurantNameTaken = jest
          .fn()
          .mockReturnValue(of(false));
        const nameInput = nativeElement.querySelector(
          'input#restaurantName'
        ) as HTMLInputElement;
        const descriptionTextarea = nativeElement.querySelector(
          'textarea#description'
        ) as HTMLInputElement;

        nameInput.value = 'New Restaurant Name';
        nameInput.dispatchEvent(new Event('input'));
        nameInput.dispatchEvent(new Event('blur'));
        descriptionTextarea.value = 'Restaurant Description';
        descriptionTextarea.dispatchEvent(new Event('input'));

        selectOption(fixture, KeyCode.ArrowDown, 1);

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      }));
      it('should enables the button', () => {
        expect(button?.disabled).toBeFalsy();
      });
      it('should call onClickCreate when click the Create button', () => {
        jest.spyOn(component, 'onClickCreate');

        button.click();
        expect(component.onClickCreate).toHaveBeenCalled();
      });
    });
    describe('Invalid input', () => {
      let button: any;
      beforeEach(fakeAsync(() => {
        restaurantService.isRestaurantNameTaken = jest
          .fn()
          .mockReturnValue(of(false));
        const nameInput = nativeElement.querySelector(
          'input#restaurantName'
        ) as HTMLInputElement;
        const descriptionTextarea = nativeElement.querySelector(
          'textarea#description'
        ) as HTMLInputElement;

        nameInput.value = 'New Restaurant Name';
        nameInput.dispatchEvent(new Event('input'));
        nameInput.dispatchEvent(new Event('blur'));
        descriptionTextarea.value = 'Invalid';
        descriptionTextarea.dispatchEvent(new Event('input'));

        selectOption(fixture, KeyCode.ArrowDown, 1);

        fixture.detectChanges();
        button = nativeElement.querySelector('button');
      }));
      it('should disables the button', () => {
        expect(button?.disabled).toBeTruthy();
      });
      it('should not call onClickCreate when click the Create button', () => {
        jest.spyOn(component, 'onClickCreate');

        button.click();
        expect(component.onClickCreate).not.toHaveBeenCalled();
      });
    });
  });
  describe('Validation', () => {
    const inputTestCases = [
      { field: 'restaurantName', value: '', error: 'Name is required' },
      {
        field: 'restaurantName',
        value: '1234',
        error: 'Name must be between 5 and 30 characters long',
      },
      {
        field: 'restaurantName',
        value: '1234567890123456789012345678901',
        error: 'Name must be between 5 and 30 characters long',
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
      { field: 'description', value: '', error: 'Description is required' },
      {
        field: 'description',
        value: '1234',
        error: 'Description must be between 20 and 300 characters long',
      },
      {
        field: 'description',
        value: '1234567890123456789012345678901'.repeat(10),
        error: 'Description must be between 20 and 300 characters long',
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
    it('should display "Name is already taken." when restaurant name is not unique', () => {
      restaurantService.isRestaurantNameTaken = jest
        .fn()
        .mockReturnValue(of(true));

      const restaurantName = nativeElement.querySelector(
        'input#restaurantName'
      ) as HTMLInputElement;

      restaurantName.value = 'New Restaurant Name';
      restaurantName.dispatchEvent(new Event('input'));
      restaurantName.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const validationErrorElement = nativeElement.querySelector(
        `div[data-testid="restaurantName-validation"]`
      );
      expect(validationErrorElement.textContent).toEqual(
        ' Name is already taken. '
      );
    });
  });
  describe('Class', () => {
    describe('onClickCreate', () => {
      it('should call restaurantService.create with correct params when form is valid', () => {
        restaurantService.isRestaurantNameTaken = jest
          .fn()
          .mockReturnValueOnce(of(false));

        restaurantService.create = jest
          .fn()
          .mockImplementationOnce(() => of(true));

        component.form.get('restaurantName')?.setValue('New Restaurant Name');
        component.form.get('description')?.setValue('Restaurant Description');
        component.form
          .get('categories')
          ?.setValue([primaryCategory2Mock.id] as never);

        component.onClickCreate();

        expect(restaurantService.create).toHaveBeenCalledWith({
          name: 'New Restaurant Name',
          description: 'Restaurant Description',
          owner: userMock.id,
          categories: [primaryCategory2Mock.id],
          file: undefined,
        });
      });
      it('should not call restaurantService.create when form is invalid', async () => {
        component.onClickCreate();

        expect(restaurantService.create).not.toHaveBeenCalled();
      });
      it('should navigate to Restaurant Page when creation was success', fakeAsync(() => {
        restaurantService.isRestaurantNameTaken = jest
          .fn()
          .mockReturnValueOnce(of(false));
        userService.create = jest.fn().mockReturnValueOnce(of(restaurantMock));

        component.form.get('restaurantName')?.setValue('New Restaurant Name');
        component.form.get('description')?.setValue('Restaurant Description');
        component.form
          .get('categories')
          ?.setValue([primaryCategory2Mock.id] as never);

        component.onClickCreate();
        fixture.detectChanges();
        tick();

        expect(location.path()).toEqual('/restaurants/1');
      }));
    });
  });
});
