import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, take } from 'rxjs';
import { Toast } from 'bootstrap';
import { ToastEventType } from '../../../shared/models/toast-event/toast-event-type.interface';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Output() disposeEvent = new EventEmitter();

  @ViewChild('toastElement', { static: true })
  toastEl!: ElementRef;

  @Input()
  type!: ToastEventType;

  @Input()
  title!: string;

  @Input()
  message!: string;

  toast!: Toast;

  ngOnInit() {
    this.show();
  }

  show() {
    this.toast = new Toast(this.toastEl.nativeElement, {
      autohide: true,
      delay: 2000,
    });
    fromEvent(this.toastEl.nativeElement, 'hidden.bs.toast')
      .pipe(take(1))
      .subscribe(() => this.hide());
    this.toast.show();
  }

  hide() {
    this.toast.dispose();
    this.disposeEvent.emit();
  }
}
