import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ButtonComponent } from './components/button/button.component';
import { CategoryComponent } from './components/category/category.component';
import { RestaurantItemBlockComponent } from './components/restaurant-item-block/restaurant-item-block.component';
import { CartItemBlockComponent } from './components/cart-item-block/cart-item-block.component';
import { RestaurantRowBlockComponent } from './components/restaurant-row-block/restaurant-row-block.component';
import { ScrollListComponent } from './components/scroll-list/scroll-list.component';
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
    NgbModule,
    DragScrollModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
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
