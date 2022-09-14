import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Cart } from '../../../shared/models/cart/cart';

@Component({
  selector: 'app-past-order-row',
  templateUrl: './past-order-row.component.html',
  styleUrls: ['./past-order-row.component.scss'],
})
export class PastOrderRowComponent implements OnInit {
  @Input() cart: Cart | undefined;

  ngOnInit(): void {}

  get id(): string {
    return `past-order-${this.cart!.id}`;
  }

  @HostListener('show.bs.collapse', ['$event'])
  onBsCollapseShow() {
    const parentElement = document.querySelector(`#${this.id}`)
      ?.parentElement as HTMLElement;
    const iconElement = parentElement.querySelector(
      '#dropdown-icon'
    ) as HTMLElement;

    iconElement.classList.add('bi-caret-up-fill');
    iconElement.classList.remove('bi-caret-down-fill');
  }

  @HostListener('hide.bs.collapse', ['$event'])
  onBsCollapseHide() {
    const parentElement = document.querySelector(`#${this.id}`)
      ?.parentElement as HTMLElement;
    const iconElement = parentElement.querySelector(
      '#dropdown-icon'
    ) as HTMLElement;

    iconElement.classList.remove('bi-caret-up-fill');
    iconElement.classList.add('bi-caret-down-fill');
  }
}
