import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantBlockComponent } from './restaurant-block.component';

describe('RestaurantBlockComponent', () => {
  let component: RestaurantBlockComponent;
  let fixture: ComponentFixture<RestaurantBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
