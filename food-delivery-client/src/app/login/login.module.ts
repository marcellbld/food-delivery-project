import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [CommonModule, SharedModule, LoginRoutingModule],
})
export class LoginModule {}
