import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { CartService } from './services/cart/cart.service';
import { RestaurantService } from './services/restaurant/restaurant.service';
import { RestaurantItemService } from './services/restaurant-item/restaurant-item.service';
import { AuthStorageService } from './services/auth-storage/auth-storage.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    AuthService,
    AuthStorageService,
    UserService,
    RestaurantService,
    RestaurantItemService,
    CartService
  ],
})
export class CoreModule {}
