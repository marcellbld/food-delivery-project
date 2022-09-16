import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['./price-input.component.scss'],
})
export class PriceInputComponent implements OnInit {
  @Input() priceFormControl!: FormControl;
  @Input() priceError!: any;

  constructor(private readonly currencyPipe: CurrencyPipe) {}

  ngOnInit(): void {}

  transformAmount(element: any) {
    const fl = parseFloat(this.priceFormControl?.value!);
    this.priceFormControl?.setValue(this.currencyPipe.transform(fl, 'USD', ''));
  }
}
