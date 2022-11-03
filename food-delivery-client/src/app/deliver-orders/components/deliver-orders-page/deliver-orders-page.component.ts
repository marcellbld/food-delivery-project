import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../../../shared/components/map/map.component';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartI } from '../../../shared/models/cart/cart.interface';
import { Coordinate } from 'ol/coordinate';
import { OrderI } from '../../../shared/models/order/order.interface';
import { OrderService } from '../../../core/services/order/order.service';

@Component({
  selector: 'app-deliver-orders-page',
  templateUrl: './deliver-orders-page.component.html',
  styleUrls: ['./deliver-orders-page.component.scss'],
})
export class DeliverOrdersPageComponent implements OnInit {
  undeliveredCarts: CartI[] = [];
  activeOrder: OrderI | undefined;
  clickedCartElement: HTMLElement | null = null;

  userCoordinate: Coordinate | undefined;
  restaurantCoordinate: Coordinate | undefined;

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService
  ) {}

  isElementClicked(id: number): boolean {
    return this.clickedCartElement?.dataset?.['cartid'] == '' + id;
  }

  ngOnInit(): void {
    this.cartService.findAllUndelivered().subscribe((result) => {
      const carts = result as CartI[];
      this.undeliveredCarts = carts;
    });

    this.orderService.findSelfActiveOrder().subscribe((result) => {
      this.activeOrder = result as OrderI;
    });
  }
  clickOnCartBlock(event: any): void {
    if (event.target.nodeName === 'BUTTON') return;

    this.clickedCartElement = event.target.closest('app-cart-order-block');

    setTimeout(() => {
      this.clickedCartElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, 550);
  }

  // @HostListener('shown.bs.modal', ['$event'])
  // onModalOpen() {
  //   setTimeout(() => {
  //     const clickedCartId = this.clickedCartElement?.dataset?.['cartid'];

  //     if (!clickedCartId) return;

  //     let clickedCart = this.undeliveredCarts.find(
  //       (cart) => cart.id === Number.parseInt(clickedCartId)
  //     );

  //     if (
  //       !clickedCart &&
  //       this.activeOrder &&
  //       this.activeOrder.cart!.id === Number.parseInt(clickedCartId)
  //     ) {
  //       clickedCart = this.activeOrder.cart;
  //     } else if (!clickedCart) {
  //       return;
  //     }

  //     this.restaurantCoordinate = clickedCart!.restaurant.location;
  //     this.userCoordinate = clickedCart!.user.address;

  //     this.mapComponent?.refreshMap();
  //   }, 100);
  // }
}
