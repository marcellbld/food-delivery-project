import { Component } from '@angular/core';
import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'food-delivery-client';
  public isCollapsed = false;
}
