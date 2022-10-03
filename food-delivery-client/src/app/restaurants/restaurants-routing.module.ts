import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role.guard';
import { UserRole } from '../shared/models/user/user.interface';
import { CreateRestaurantItemPageComponent } from './components/create-restaurant-item-page/create-restaurant-item-page.component';
import { CreateRestaurantPageComponent } from './components/create-restaurant-page/create-restaurant-page.component';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
const routes: Routes = [
  {
    path: 'create',
    component: CreateRestaurantPageComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [UserRole.Admin, UserRole.Owner],
    },
  },
  {
    path: 'edit',
    component: CreateRestaurantPageComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [UserRole.Admin, UserRole.Owner],
    },
  },
  {
    path: ':id/create-item',
    component: CreateRestaurantItemPageComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [UserRole.Admin, UserRole.Owner],
    },
  },
  {
    path: ':id/edit-item',
    component: CreateRestaurantItemPageComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [UserRole.Admin, UserRole.Owner],
    },
  },
  { path: ':id', component: RestaurantPageComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantsRoutingModule {}
