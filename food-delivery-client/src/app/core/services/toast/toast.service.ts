import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastEventType } from '../../../shared/models/toast-event/toast-event-type.interface';
import { ToastEvent } from '../../../shared/models/toast-event/toast-event.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastEvents: Observable<ToastEvent>;
  private _toastEvents = new Subject<ToastEvent>();

  constructor() {
    this.toastEvents = this._toastEvents.asObservable();
  }

  showSuccessToast(message: string) {
    this._toastEvents.next({
      message,
      type: ToastEventType.Success,
    });
  }
  showErrorToast(message: string) {
    this._toastEvents.next({
      message,
      type: ToastEventType.Error,
    });
  }
}
