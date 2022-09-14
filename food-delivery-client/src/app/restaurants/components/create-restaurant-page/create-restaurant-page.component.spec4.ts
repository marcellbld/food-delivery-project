import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from 'express';
import { UserService } from 'src/app/core/services/user/user.service';
import { HomePageComponent } from 'src/app/home/components/home-page/home-page.component';
import { LoginPageComponent } from 'src/app/login/components/login-page/login-page.component';
import { RegistrationPageComponent } from 'src/app/registration/components/registration-page/registration-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { CreateRestaurantPageComponent } from './create-restaurant-page.component';

describe('CreateRestaurantPageComponent', () => {
  let component: CreateRestaurantPageComponent;
  let fixture: ComponentFixture<CreateRestaurantPageComponent>;

  let restaurantService: RestaurantService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const userServiceMock = {
      findById: jest.fn(),
      create: jest.fn(),
      isUsernameTaken: jest.fn(),
    } as Partial<UserService>;

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
      providers: [{ provide: UserService, useValue: userServiceMock }],
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
    describe('Base', () => {});
  });
});
