import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapModalEvent } from '../../../shared/models/map-modal-event/map-modal-event.interface';
import { MapComponent } from '../../../shared/components/map/map.component';
import { MapModalService } from '../../../core/services/map-modal/map-modal.service';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  @ViewChild(MapComponent)
  mapComponent!: MapComponent;

  @ViewChild('openModalButton')
  openModalButton!: ElementRef;

  mainCoordinate: Coordinate | undefined;
  secondaryCoordinate: Coordinate | undefined;
  route: boolean | undefined;

  constructor(private mapModalService: MapModalService) {}

  ngOnInit(): void {
    this.mapModalService.mapModalEvents.subscribe((event: MapModalEvent) => {
      this.route = event.route;
      this.mainCoordinate = event.mainCoordinate;
      this.secondaryCoordinate = event.secondaryCoordinate;

      this.openModalButton!.nativeElement!.click();

      this.mapComponent?.refreshMap();
    });
  }
}
