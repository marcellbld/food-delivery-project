import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragScrollModule } from 'ngx-drag-scroll';
import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { SharedModule } from '../shared/shared.module';
import { CreateRestaurantPageComponent } from './components/create-restaurant-page/create-restaurant-page.component';
import { CreateRestaurantItemPageComponent } from './components/create-restaurant-item-page/create-restaurant-item-page.component';

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
