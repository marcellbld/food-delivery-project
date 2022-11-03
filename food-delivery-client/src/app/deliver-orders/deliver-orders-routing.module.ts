import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role.guard';
import { UserRole } from '../shared/models/user/user.interface';
import { DeliverOrdersPageComponent } from './components/deliver-orders-page/deliver-orders-page.component';

const routes: Routes = [
  {
    path: '',
    component: DeliverOrdersPageComponent,
    pathMatch: 'full',
    canActivate: [RoleGuard],
    data: {
      roles: [UserRole.Courier],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliverOrdersRoutingModule {}
