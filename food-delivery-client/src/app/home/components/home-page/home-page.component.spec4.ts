import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { SharedModule } from '../../../shared/shared.module';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  let restaurantServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    restaurantServiceMock = {
      findAll: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule, SharedModule],
      declarations: [HomePageComponent],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  describe('Layout', () => {
    it('');
  });
});
