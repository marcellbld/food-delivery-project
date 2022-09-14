import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getRestaurantImageUrl } from '../../../shared/utils/image-url-helper';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { RestaurantItemI } from '../../../shared/models/restaurant-item/restaurant-item.interface';
import { RestaurantItemService } from '../../../core/services/restaurant-item/restaurant-item.service';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss'],
})
export class RestaurantPageComponent implements OnInit {
  restaurant: RestaurantI | undefined;
  popularRestaurantItems: RestaurantItemI[] | undefined;
  restaurantItems: RestaurantItemI[] | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly restaurantService: RestaurantService,
    private readonly restaurantItemService: RestaurantItemService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit(): void {
    this.getRestaurant();
  }

  getRestaurantImageUrl(): string {
    return getRestaurantImageUrl(this.restaurant?.image);
  }

  getRestaurant(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.restaurantService.findOne(id).subscribe({
      next: (result) => {
        this.restaurant = result;

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
