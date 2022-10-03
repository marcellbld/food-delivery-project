import { ToastEventType } from './toast-event-type.interface';

export interface ToastEvent {
  type: ToastEventType;
  message: string;
}
