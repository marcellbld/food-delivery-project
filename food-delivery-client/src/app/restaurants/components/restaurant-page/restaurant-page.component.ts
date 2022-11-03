import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getRestaurantImageUrl } from '../../../shared/utils/image-url-helper';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { RestaurantItemI } from '../../../shared/models/restaurant-item/restaurant-item.interface';
import { RestaurantItemService } from '../../../core/services/restaurant-item/restaurant-item.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole } from '../../../shared/models/user/user.interface';
import { MapAddressService } from '../../../core/services/map-address/map-address.service';
import { Coordinate } from 'ol/coordinate';
import { UserService } from '../../../core/services/user/user.service';
import { MapModalService } from '../../../core/services/map-modal/map-modal.service';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss'],
})
export class RestaurantPageComponent implements OnInit {
  restaurant: RestaurantI | undefined;
  popularRestaurantItems: RestaurantItemI[] | undefined;
  restaurantItems: RestaurantItemI[] | undefined;

  locationText: string = '';
  userCoordinate: Coordinate | undefined;
  restaurantCoordinate: Coordinate | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly restaurantService: RestaurantService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly restaurantItemService: RestaurantItemService,
    private readonly mapAddressService: MapAddressService,
    private readonly mapModalService: MapModalService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  isUserRoleUser(): boolean | undefined {
    const role = this.authService.loggedInUser()?.role;
    return role && role === UserRole.User;
  }

  isUserRoleOwnerOrAdmin(): boolean | undefined {
    const role = this.authService.loggedInUser()?.role;
    return role && (role === UserRole.Admin || role === UserRole.Owner);
  }

  ngOnInit(): void {
    this.getRestaurant();

    if (this.authService.isLoggedIn()) {
      this.userService.findSelf().subscribe((result) => {
        const user = result;
        this.userCoordinate = user.address;
      });
    }
  }

  onClickShowMapButton(): void {
    this.mapModalService.showModal({
      mainCoordinate: this.restaurantCoordinate,
      secondaryCoordinate: this.userCoordinate,
      route: false,
    });
  }

  onClickEditButton(): void {
    this.router.navigate([`/restaurants/edit`], {
      state: { restaurant: this.restaurant },
      replaceUrl: true,
    });
  }
  onClickCreateItemButton(): void {
    this.router.navigateByUrl(
      `/restaurants/${this.restaurant!.id}/create-item`
    );
  }

  getRestaurantImageUrl(): string {
    return getRestaurantImageUrl(this.restaurant?.image);
  }

  isRestaurantSelf(): boolean {
    if (!this.restaurant) return false;

    return this.restaurantService.isRestaurantSelf(this.restaurant.id);
  }

  getRestaurant(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.restaurantService.findOne(id).subscribe({
      next: (result) => {
        this.restaurant = result;
        this.restaurantCoordinate = this.restaurant.location;
        this.mapAddressService
          .findAddressByCoordinate(
            this.restaurant.location[0],
            this.restaurant.location[1]
          )
          .subscribe((result: any) => {
            const address = result.address;
            this.locationText = `${address.postcode}, ${address.road}, ${address.house_number}`;
          });

        this.getRestaurantItems();
        this.getPopularRestaurantItems();
      },
      error: () => {
        this.router.navigateByUrl('/');
      },
    });
  }

  getRestaurantItems(): void {
    this.restaurantItemService
      .findAll(this.restaurant?.id!)
      .subscribe((result) => {
        this.restaurantItems = result;
      });
  }

  getPopularRestaurantItems(): void {
    this.restaurantItemService
      .findAllPopulars(this.restaurant?.id!)
      .subscribe((result) => {
        this.popularRestaurantItems = result;
      });
  }
}
