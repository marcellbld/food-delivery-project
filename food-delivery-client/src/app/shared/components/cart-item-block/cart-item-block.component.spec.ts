import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { cartItemMock } from '../../../../test/mocks/cart-item.mock';
import { Cart } from '../../models/cart/cart';

import { CartItemBlockComponent } from './cart-item-block.component';

describe('CartItemBlockComponent', () => {
  let component: CartItemBlockComponent;
  let fixture: ComponentFixture<CartItemBlockComponent>;

  let cartService: any;

  beforeEach(async () => {
    const cartServiceMock = {
      deleteItem: jest.fn(),
      modifyItem: jest.fn(),
    } as Partial<CartService>;

    await TestBed.configureTestingModule({
      declarations: [CartItemBlockComponent],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    fixture = TestBed.createComponent(CartItemBlockComponent);
    component = fixture.componentInstance;

    component.cartItem = cartItemMock;

    fixture.detectChanges();
  });

  let nativeElement: any;
  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  beforeEach(() => {
    cartService.deleteItem = jest.fn().mockImplementationOnce((_: number) => {
      return of(true);
    });
    cartService.modifyItem = jest
      .fn()
      .mockImplementationOnce((id: number, count: number) => {
        return of({ ...cartItemMock, count });
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Layout', () => {
    it('has image of restaurant item', () => {
      const image = nativeElement.querySelector('img');

      expect(image).toBeTruthy();
    });
    it('should display name of restaurant item', () => {
      const span = nativeElement.querySelector('span[data-testid="item-name"]');
      expect(span.textContent).toEqual('Test Restaurant Item');
    });
    it('should display price', () => {
      const span = nativeElement.querySelector('span[data-testid="price"]');
      expect(span.textContent).toEqual('$1.10');
    });
    it('should display count', () => {
      const span = nativeElement.querySelector('span[data-testid="count"]');
      expect(span.textContent).toEqual('2');
    });
    it('has Modify plus button', () => {
      const button = nativeElement.querySelector(
        'button[data-testid="modify-btn-plus"]'
      );
      expect(button).toBeTruthy();
    });
    it('has Modify minus button', () => {
      const button = nativeElement.querySelector(
        'button[data-testid="modify-btn-minus"]'
      );
      expect(button).toBeTruthy();
    });
    it('has Delete button', () => {
      const button = nativeElement.querySelector(
        'button[data-testid="delete-btn"]'
      );
      expect(button).toBeTruthy();
    });
  });
  describe('Interaction', () => {
    it('should call clickOnModifyButton with correct params when click on Modify plus button', () => {
      jest.spyOn(component, 'clickOnModifyButton');
      const button = nativeElement.querySelector(
        'button[data-testid="modify-btn-plus"]'
      );

      button.click();

      expect(component.clickOnModifyButton).toHaveBeenCalledWith(true);
    });
    it('should call clickOnModifyButton with correct params when click on Modify minus button', () => {
      jest.spyOn(component, 'clickOnModifyButton');
      const button = nativeElement.querySelector(
        'button[data-testid="modify-btn-minus"]'
      );

      button.click();

      expect(component.clickOnModifyButton).toHaveBeenCalledWith(false);
    });
    it('should call clickOnDeleteButton when click on Delete button', () => {
      jest.spyOn(component, 'clickOnDeleteButton');
      const button = nativeElement.querySelector(
        'button[data-testid="delete-btn"]'
      );

      button.click();

      expect(component.clickOnDeleteButton).toHaveBeenCalledTimes(1);
    });
  });
  describe('Class', () => {
    describe('clickOnDeleteButton', () => {
      it('should call cartService.deleteItem with correct params', () => {
        jest.spyOn(cartService, 'deleteItem');

        component.clickOnDeleteButton();

        expect(cartService.deleteItem).toHaveBeenCalledWith(1);
      });
    });
    describe('clickOnModifyButton', () => {
      it('should call cartService.modifyItem with correct params when add is true', () => {
        jest.spyOn(cartService, 'modifyItem');

        component.clickOnModifyButton(true);

        expect(cartService.modifyItem).toHaveBeenCalledWith(1, 3);
      });
      it('should call cartService.modifyItem with correct params when add is false', () => {
        jest.spyOn(cartService, 'modifyItem');

        component.clickOnModifyButton(false);

        expect(cartService.modifyItem).toHaveBeenCalledWith(1, 1);
      });
    });
  });
});
