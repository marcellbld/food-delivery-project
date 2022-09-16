import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { SharedModule } from '../shared/shared.module';
import { CreateRestaurantPageComponent } from './components/create-restaurant-page/create-restaurant-page.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateRestaurantItemPageComponent } from './components/create-restaurant-item-page/create-restaurant-item-page.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RestaurantPageComponent,
    CreateRestaurantPageComponent,
    CreateRestaurantItemPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    DragScrollModule,
    RestaurantsRoutingModule,
  ],
  providers: [CurrencyPipe],
})
export class RestaurantsModule {}
