import { Component, Input, OnInit } from '@angular/core';
import { RestaurantI } from '../../models/restaurant/restaurant.interface';
import { getRestaurantImageUrl } from '../../utils/image-url-helper';

@Component({
  selector: 'app-self-restaurant-block',
  templateUrl: './self-restaurant-block.component.html',
  styleUrls: ['./self-restaurant-block.component.scss'],
})
export class SelfRestaurantBlockComponent implements OnInit {
  @Input() restaurant: RestaurantI | undefined;

  constructor() {}

  getRestaurantImageUrl(): string {
    return getRestaurantImageUrl(this.restaurant?.image);
  }

  ngOnInit(): void {}
}
