import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRestaurantItemPageComponent } from './components/create-restaurant-item-page/create-restaurant-item-page.component';
import { CreateRestaurantPageComponent } from './components/create-restaurant-page/create-restaurant-page.component';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
const routes: Routes = [
  { path: 'create', component: CreateRestaurantPageComponent },
  { path: ':id/create-item', component: CreateRestaurantItemPageComponent },
  { path: ':id', component: RestaurantPageComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantsRoutingModule {}
