import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MapModalEvent } from '../../../shared/models/map-modal-event/map-modal-event.interface';

@Injectable({
  providedIn: 'root',
})
export class MapModalService {
  mapModalEvents: Observable<MapModalEvent>;
  private _mapModalEvents = new Subject<MapModalEvent>();

  constructor() {
    this.mapModalEvents = this._mapModalEvents.asObservable();
  }

  showModal(event: MapModalEvent) {
    this._mapModalEvents.next(event);
  }
}
