import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { Router } from '@angular/router';
import { getRestaurantImageUrl } from '../../../shared/utils/image-url-helper';
import { RestaurantItemI } from '../../../shared/models/restaurant-item/restaurant-item.interface';
import { RestaurantItemService } from '../../../core/services/restaurant-item/restaurant-item.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-restaurant-block',
  templateUrl: './restaurant-block.component.html',
  styleUrls: ['./restaurant-block.component.scss'],
})
export class RestaurantBlockComponent implements OnInit {
  @Input() clicked: boolean = false;

  @Input() restaurant: RestaurantI | null = null;

  popularRestaurantItems: Observable<RestaurantItemI[]> = of([]);

  constructor(
    private readonly router: Router,
    private readonly restaurantItemService: RestaurantItemService
  ) {}

  ngOnInit(): void {}

  getRestaurantImageUrl(): string {
    return getRestaurantImageUrl(this.restaurant?.image);
  }

  navigateToRestaurantPage() {
    if (this.restaurant === null) {
      this.router.navigate(['']);
      return;
    }

    this.router.navigateByUrl(`/restaurants/${this.restaurant.id}`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['clicked'] &&
      changes['clicked']?.previousValue != changes['clicked']?.currentValue
    ) {
      if (changes['clicked'].currentValue) {
        this.popularRestaurantItems =
          this.restaurantItemService.findAllPopulars(this.restaurant?.id!);
      }
    }
  }

  loadPopularRestaurantItems(): void {
    this.popularRestaurantItems = this.restaurantItemService.findAllPopulars(
      this.restaurant?.id!
    );
  }
}
