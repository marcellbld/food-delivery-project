import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapModalComponent } from './components/map-modal/map-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MapModalComponent],
  imports: [CommonModule, SharedModule],
  exports: [MapModalComponent],
})
export class MapModalModule {}
