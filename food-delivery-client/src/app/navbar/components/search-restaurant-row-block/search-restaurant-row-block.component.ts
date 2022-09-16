import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { getRestaurantImageUrl } from '../../../shared/utils/image-url-helper';

@Component({
  selector: 'app-search-restaurant-row-block',
  templateUrl: './search-restaurant-row-block.component.html',
  styleUrls: ['./search-restaurant-row-block.component.scss'],
})
export class SearchRestaurantRowBlockComponent implements OnInit {
  @Input() restaurant: RestaurantI | undefined;

  constructor(private router: Router) {}

  getRestaurantImageUrl(): string {
    return getRestaurantImageUrl(this.restaurant?.image);
  }

  ngOnInit(): void {}

  onClick(): void {
    this.router.navigateByUrl(`/restaurants/${this.restaurant!.id}`);
  }
}
