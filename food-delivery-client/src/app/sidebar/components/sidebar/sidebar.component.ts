import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Cart } from '../../../shared/models/cart/cart';
import { UserI, UserRole } from '../../../shared/models/user/user.interface';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Coordinate } from 'ol/coordinate';
import { MapModalService } from '../../../core/services/map-modal/map-modal.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  private selfUser: UserI | undefined;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly restaurantService: RestaurantService,
    private readonly toastService: ToastService,
    private readonly mapModalService: MapModalService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userService.findSelf().subscribe((result) => {
        this.selfUser = result as UserI;
      });
    }
  }

  get cart(): Cart | undefined {
    return this.cartService.selfActiveCart;
  }

  get selfRestaurants(): RestaurantI[] | undefined {
    return this.restaurantService.selfRestaurants;
  }

  hasSelfRestaurants(): boolean {
    return (
      this.restaurantService.selfRestaurants !== undefined &&
      this.restaurantService.selfRestaurants!.length > 0
    );
  }

  isCartEmpty(): boolean {
    return this.isLoggedIn && (!this.cart || this.cart.cartItems.length === 0);
  }

  getTotalCost(): number {
    return this.cartService.selfActiveCart?.calculateTotalCost()!;
  }

  isCartWaitingForCourier(): boolean {
    return (
      this.cartService.selfActiveCart !== undefined &&
      this.cartService.selfActiveCart.purchased &&
      this.cartService.selfActiveCart.order === null
    );
  }
  isCartOnTheWay(): boolean {
    return (
      this.cartService.selfActiveCart !== undefined &&
      this.cartService.selfActiveCart.purchased &&
      this.cartService.selfActiveCart.order !== null
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn() || false;
  }

  get loggedInUsername(): string {
    return this.authService.loggedInUser()?.username || '';
  }
  get loggedInUserRole(): string {
    return this.authService.loggedInUser()?.role || UserRole.User;
  }

  clickLogOutButton(): void {
    this.authService.logout();
  }

  clickOnShowMap(): void {
    this.mapModalService.showModal({
      mainCoordinate: this.cart?.restaurant.location,
      secondaryCoordinate: this.selfUser?.address,
      route: true,
    });
  }

  clickOnDeleteButton(): void {
    this.cartService
      .deleteSelfCart(this.cart?.id!)
      .subscribe(() => this.toastService.showSuccessToast('Cart deleted!'));
  }

  clickOnCheckoutButton(): void {
    this.cartService
      .checkoutCart()
      .subscribe(() => this.toastService.showSuccessToast('Order Successful!'));
  }
}
