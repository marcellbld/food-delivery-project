import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItemI } from '../../models/cart/cart-item.interface';
import { RestaurantItemI } from '../../models/restaurant-item/restaurant-item.interface';
import { getRestaurantItemImageUrl } from '../../utils/image-url-helper';

@Component({
  selector: 'app-cart-item-block',
  templateUrl: './cart-item-block.component.html',
  styleUrls: ['./cart-item-block.component.scss'],
})
export class CartItemBlockComponent implements OnInit {
  @Input() cartItem: CartItemI | null = null;
  @Input() modifiable: boolean = true;

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {}

  get restaurantItem(): RestaurantItemI {
    return this.cartItem?.item!;
  }

  getRestaurantItemImageUrl(): string {
    return getRestaurantItemImageUrl(undefined);
  }

  clickOnDeleteButton(): void {
    this.cartService.deleteItem(this.cartItem?.id!).subscribe();
  }
  clickOnModifyButton(add: boolean): void {
    this.cartService
      .modifyItem(this.cartItem?.id!, this.cartItem?.count! + (add ? 1 : -1))
      .subscribe();
  }
}
