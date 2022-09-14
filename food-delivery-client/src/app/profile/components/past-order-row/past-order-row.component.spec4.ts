import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastOrderRowComponent } from './past-order-row.component';

describe('PastOrderRowComponent', () => {
  let component: PastOrderRowComponent;
  let fixture: ComponentFixture<PastOrderRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastOrderRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastOrderRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
