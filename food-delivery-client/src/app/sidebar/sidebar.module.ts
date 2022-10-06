import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SidebarComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [SidebarComponent],
})
export class SidebarModule {}
