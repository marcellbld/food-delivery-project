import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantItemService } from '../../../core/services/restaurant-item/restaurant-item.service';
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
  @Input() editable: boolean = false;

  @Input() restaurantItem!: RestaurantItemI;

  constructor(
    private readonly cartService: CartService,
    private readonly restaurantItemService: RestaurantItemService,
    private readonly router: Router
  ) {}

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

  onClickBuyButton(): void {
    this.cartService.addItemToCart(this.restaurantItem?.id!).subscribe();
  }
  onClickModifyButton(add: boolean): void {
    const cartItem = this.cartItem() as CartItemI;
    this.cartService
      .modifyItem(cartItem?.id, cartItem?.count + (add ? 1 : -1))
      .subscribe();
  }

  onClickEditButton(): void {
    this.router.navigate(
      [`/restaurants/${this.restaurantItem.restaurant.id}/edit-item`],
      { state: { restaurantItem: this.restaurantItem }, replaceUrl: true }
    );
  }
  onClickDeleteButton(): void {
    this.restaurantItemService
      .delete(this.restaurantItem.restaurant.id, this.restaurantItem.id)
      .subscribe((_) => {
        this.router.navigate([this.router.url]);
      });
  }

  getRestaurantItemImageUrl(): string {
    return getRestaurantItemImageUrl(this.restaurantItem.image);
  }

  ngOnInit(): void {}
}
