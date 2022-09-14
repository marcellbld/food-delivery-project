import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  primaryCategory1Mock,
  secondaryCategory1Mock,
} from '../../../../test/mocks/category.mock';

import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let nativeElement: any;
  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Layout', () => {
    describe('Primary Category', () => {
      beforeEach(() => {
        component.category = primaryCategory1Mock;
        fixture.detectChanges();
      });
      it('should assign the correct class', () => {
        const div = nativeElement.querySelector('div');
        expect(div.classList).toContain('bg-primary');
        expect(div.classList).not.toContain('bg-warning');
      });
      it('should display the category name', () => {
        const text = nativeElement.querySelector('span small');
        expect(text.textContent).toEqual('Primary 1');
      });
    });
    describe('Secondary Category', () => {
      beforeEach(() => {
        component.category = secondaryCategory1Mock;
        fixture.detectChanges();
      });
      it('should assign the correct class', () => {
        const div = nativeElement.querySelector('div');
        expect(div.classList).toContain('bg-warning');
        expect(div.classList).not.toContain('bg-primary');
      });
      it('should display the category name', () => {
        const text = nativeElement.querySelector('span small');
        expect(text.textContent).toEqual('Secondary 1');
      });
    });
  });
});
