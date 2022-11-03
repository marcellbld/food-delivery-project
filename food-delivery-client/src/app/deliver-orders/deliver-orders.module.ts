import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliverOrdersPageComponent } from './components/deliver-orders-page/deliver-orders-page.component';
import { DeliverOrdersRoutingModule } from './deliver-orders-routing.module';
import { CartOrderBlockComponent } from './components/cart-order-block/cart-order-block.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DeliverOrdersPageComponent, CartOrderBlockComponent],
  imports: [CommonModule, SharedModule, DeliverOrdersRoutingModule],
})
export class DeliverOrdersModule {}
