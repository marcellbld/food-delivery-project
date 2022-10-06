import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  restaurants: RestaurantI[] = [];

  clickedRestaurantElement: HTMLElement | null = null;

  constructor(private readonly restaurantService: RestaurantService) {}

  isElementClicked(id: number): boolean {
    return this.clickedRestaurantElement?.dataset?.['restaurantid'] == '' + id;
  }

  ngOnInit(): void {
    this.restaurantService
      .findAll(0)
      .subscribe((result) => (this.restaurants = result));
  }

  clickOnRestaurantBlock(event: any): void {
    if (event.target.nodeName === 'BUTTON') return;

    this.clickedRestaurantElement = event.target.closest(
      'app-restaurant-block'
    );

    setTimeout(() => {
      this.clickedRestaurantElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, 550);
  }
}
