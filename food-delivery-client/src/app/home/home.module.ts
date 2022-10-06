import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragScrollModule } from 'ngx-drag-scroll';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RestaurantBlockComponent } from './components/restaurant-block/restaurant-block.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomePageComponent, RestaurantBlockComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule, DragScrollModule],
})
export class HomeModule {}
