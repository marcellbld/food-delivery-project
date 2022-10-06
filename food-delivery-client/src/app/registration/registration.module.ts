import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RegistrationPageComponent],
  imports: [CommonModule, SharedModule, RegistrationRoutingModule],
})
export class RegistrationModule {}
