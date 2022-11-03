import { Component, Input, OnInit } from '@angular/core';
import { MapAddressService } from '../../../core/services/map-address/map-address.service';
import { CartI } from '../../../shared/models/cart/cart.interface';
import { OrderService } from '../../../core/services/order/order.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { OrderI } from '../../../shared/models/order/order.interface';
import { interval, Subscription, timer } from 'rxjs';
import { MapModalService } from '../../../core/services/map-modal/map-modal.service';

@Component({
  selector: 'app-cart-order-block',
  templateUrl: './cart-order-block.component.html',
  styleUrls: ['./cart-order-block.component.scss'],
})
export class CartOrderBlockComponent implements OnInit {
  @Input() clicked: boolean = false;

  @Input() cart!: CartI;
  @Input() order: OrderI | undefined;

  locationText: string = '';

  constructor(
    private readonly mapAddressService: MapAddressService,
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly mapModalService: MapModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mapAddressService
      .findAddressByCoordinate(
        this.cart.restaurant.location[0],
        this.cart.restaurant.location[1]
      )
      .subscribe((result: any) => {
        const address = result.address;
        this.locationText = `${address.postcode}, ${address.road}, ${address.house_number}`;
      });
  }

  private cdSubscription: Subscription | undefined;
  private timerSubscription: Subscription | undefined;
  cdTime: number = 0;
  ngAfterViewInit() {
    if (this.order) {
      this.cdSubscription = interval(1000).subscribe((_) => {
        this.cdTime = this.getTimeDifference(this.order?.deliveryTime!);
      });

      const diff = this.getTimeDifference(this.order?.deliveryTime!);
      this.timerSubscription = timer(diff).subscribe(() => {
        this.toastService.showSuccessToast('Order has been delivered!');

        let currentUrl = this.router.url;
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      });
    }
  }
  private getTimeDifference(date: Date | number): number {
    return new Date(date).getTime()! - new Date().getTime();
  }

  ngOnDestroy() {
    this.cdSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

  onClickShowMapButton(): void {
    this.mapModalService.showModal({
      mainCoordinate: this.cart.restaurant.location,
      secondaryCoordinate: this.cart.user.address,
      route: this.order !== undefined,
    });
  }

  onClickPickUpButton(): void {
    this.orderService
      .create({
        courier: this.authService.loggedInUser()?.id || 0,
        cart: this.cart.id,
      })
      .subscribe((_: any): void => {
        this.toastService.showSuccessToast(
          'You have successfully picked up an order!'
        );

        let currentUrl = this.router.url;
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      });
  }
}
