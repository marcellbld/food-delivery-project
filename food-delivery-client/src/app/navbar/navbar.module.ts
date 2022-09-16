import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchRestaurantRowBlockComponent } from './components/search-restaurant-row-block/search-restaurant-row-block.component';
import { DragScrollModule } from 'ngx-drag-scroll';

@NgModule({
  declarations: [
    NavbarComponent,
    SearchBarComponent,
    SearchRestaurantRowBlockComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule, DragScrollModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
