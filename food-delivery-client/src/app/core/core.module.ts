import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { CartService } from './services/cart/cart.service';
import { RestaurantService } from './services/restaurant/restaurant.service';
import { RestaurantItemService } from './services/restaurant-item/restaurant-item.service';
import { AuthStorageService } from './services/auth-storage/auth-storage.service';
import { ToastService } from './services/toast/toast.service';
import { MapAddressService } from './services/map-address/map-address.service';
import { MapModalService } from './services/map-modal/map-modal.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    AuthService,
    AuthStorageService,
    UserService,
    RestaurantService,
    RestaurantItemService,
    CartService,
    ToastService,
    MapAddressService,
    MapModalService,
  ],
})
export class CoreModule {}
