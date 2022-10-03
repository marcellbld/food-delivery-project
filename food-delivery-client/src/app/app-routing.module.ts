import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { ProfileModule } from './profile/profile.module';
import { RegistrationModule } from './registration/registration.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => LoginModule,
    canActivate: [LoginGuard],
  },
  {
    path: 'registration',
    loadChildren: () => RegistrationModule,
    canActivate: [LoginGuard],
  },
  {
    path: 'restaurants',
    loadChildren: () => RestaurantsModule,
  },
  {
    path: 'profile',
    loadChildren: () => ProfileModule,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => HomeModule,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
