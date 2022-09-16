import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { CategoryComponent } from './components/category/category.component';
import { RestaurantItemBlockComponent } from './components/restaurant-item-block/restaurant-item-block.component';
import { CartItemBlockComponent } from './components/cart-item-block/cart-item-block.component';
import { RestaurantRowBlockComponent } from './components/restaurant-row-block/restaurant-row-block.component';
import { RouterModule } from '@angular/router';
import { ScrollListComponent } from './components/scroll-list/scroll-list.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { PriceInputComponent } from './components/price-input/price-input.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CategoryComponent,
    RestaurantItemBlockComponent,
    CartItemBlockComponent,
    RestaurantRowBlockComponent,
    ScrollListComponent,
    PriceInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragScrollModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    DragScrollModule,
    ButtonComponent,
    CategoryComponent,
    RestaurantItemBlockComponent,
    CartItemBlockComponent,
    RestaurantRowBlockComponent,
    ScrollListComponent,
    PriceInputComponent,
  ],
  providers: [CurrencyPipe],
})
export class SharedModule {}
