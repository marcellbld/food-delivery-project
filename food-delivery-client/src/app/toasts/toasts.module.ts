import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ToastComponent } from './components/toast/toast.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ToastContainerComponent, ToastComponent],
  imports: [CommonModule, SharedModule],
  exports: [ToastContainerComponent],
})
export class ToastsModule {}
