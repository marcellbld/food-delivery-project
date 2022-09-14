import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { CategoryComponent } from './components/category/category.component';
import { RestaurantItemBlockComponent } from './components/restaurant-item-block/restaurant-item-block.component';
import { CartItemBlockComponent } from './components/cart-item-block/cart-item-block.component';
import { SelfRestaurantBlockComponent } from './components/self-restaurant-block/self-restaurant-block.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ButtonComponent,
    CategoryComponent,
    RestaurantItemBlockComponent,
    CartItemBlockComponent,
    SelfRestaurantBlockComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CategoryComponent,
    RestaurantItemBlockComponent,
    CartItemBlockComponent,
    SelfRestaurantBlockComponent,
  ],
  providers: [CurrencyPipe],
})
export class SharedModule {}
