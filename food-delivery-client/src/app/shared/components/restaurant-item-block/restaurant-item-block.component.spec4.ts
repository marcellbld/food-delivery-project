import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantItemBlockComponent } from './restaurant-item-block.component';

describe('RestaurantItemBlockComponent', () => {
  let component: RestaurantItemBlockComponent;
  let fixture: ComponentFixture<RestaurantItemBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantItemBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantItemBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
