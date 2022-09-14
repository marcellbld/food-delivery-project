import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItemI } from '../../models/cart/cart-item.interface';
import { RestaurantItemI } from '../../models/restaurant-item/restaurant-item.interface';
import { getRestaurantItemImageUrl } from '../../utils/image-url-helper';

@Component({
  selector: 'app-restaurant-item-block',
  templateUrl: './restaurant-item-block.component.html',
  styleUrls: ['./restaurant-item-block.component.scss'],
})
export class RestaurantItemBlockComponent implements OnInit {
  @Input() rowLayout: boolean = false;
  @Input() purchase: boolean = false;

  @Input() restaurantItem: RestaurantItemI | undefined;

  constructor(private readonly cartService: CartService) {}

  isItemInCart(): boolean {
    return (
      this.cartService.selfUnpurchasedCart?.findItem(
        this.restaurantItem?.id!
      ) !== undefined
    );
  }

  cartItem(): CartItemI | undefined {
    return this.cartService.selfUnpurchasedCart?.findItem(
      this.restaurantItem?.id!
    );
  }

  clickOnBuyButton(): void {
    this.cartService.addItemToCart(this.restaurantItem?.id!).subscribe();
  }
  clickOnModifyButton(add: boolean): void {
    const cartItem = this.cartItem() as CartItemI;
    this.cartService
      .modifyItem(cartItem?.id, cartItem?.count + (add ? 1 : -1))
      .subscribe();
  }

  getRestaurantItemImageUrl(): string {
    return getRestaurantItemImageUrl(undefined);
  }

  ngOnInit(): void {}
}
