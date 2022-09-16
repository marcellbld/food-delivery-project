import { Component, Input, OnInit } from '@angular/core';
import { RestaurantI } from '../../models/restaurant/restaurant.interface';
import { getRestaurantImageUrl } from '../../utils/image-url-helper';

@Component({
  selector: 'app-restaurant-row-block',
  templateUrl: './restaurant-row-block.component.html',
  styleUrls: ['./restaurant-row-block.component.scss'],
})
export class RestaurantRowBlockComponent implements OnInit {
  @Input() restaurant: RestaurantI | undefined;
  @Input() removable = true;
  @Input() showDescription = false;

  constructor() {}

  getRestaurantImageUrl(): string {
    return getRestaurantImageUrl(this.restaurant?.image);
  }

  ngOnInit(): void {}
}
