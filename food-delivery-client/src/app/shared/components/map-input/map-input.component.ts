import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Coordinate } from 'ol/coordinate';
import { MapAddressService } from '../../../core/services/map-address/map-address.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-map-input',
  templateUrl: './map-input.component.html',
  styleUrls: ['./map-input.component.scss'],
})
export class MapInputComponent implements OnInit {
  @ViewChild(MapComponent)
  private mapComponent: MapComponent | undefined;

  @Input() icon: string = 'shop.svg';
  @Input() location: Coordinate | number[] | undefined;
  @Output() locationChange = new EventEmitter<Coordinate | undefined>();

  postalCode = new FormControl('', [Validators.required]);
  street = new FormControl('', [Validators.required]);
  houseNumber = new FormControl('', [Validators.required]);

  invalidAddress = false;

  constructor(private mapAddressService: MapAddressService) {}

  ngOnInit(): void {
    this.mapComponent?.refreshMap();
  }

  locationChanged(coordinate: Coordinate | undefined): void {
    this.location = coordinate;

    if (coordinate) {
      this.mapAddressService
        .findAddressByCoordinate(coordinate[0], coordinate[1])
        .subscribe((result: any) => {
          const address = result.address;

          this.invalidAddress = false;

          this.postalCode.setValue(address.postcode || '');
          this.street.setValue(address.road || '');
          this.houseNumber.setValue(address.house_number || '');
          this.postalCode.markAsTouched();
          this.street.markAsTouched();
          this.houseNumber.markAsTouched();
        });
      this.locationChange.emit(this.location);
    }
  }

  addressInput(): void {
    if (this.postalCodeError || this.streetError || this.houseNumberError)
      return;

    this.mapAddressService
      .findCoordinateByAddress(
        this.houseNumber.value || '',
        this.street.value || '',
        this.postalCode.value || ''
      )
      .subscribe((result: any) => {
        const address = result.find(
          (r: any) =>
            r.class !== 'highway' &&
            r.display_name.slice(-13, -9) === this.postalCode.value
        );
        this.invalidAddress = address === undefined;

        if (address) {
          this.location = [address.lon, address.lat];
        } else {
          this.location = [];
        }
        this.locationChange.emit(this.location);
      });
  }
  get formError() {
    return (
      this.postalCodeError ||
      this.streetError ||
      this.houseNumberError ||
      this.invalidAddressError
    );
  }
  get postalCodeError() {
    if (
      this.postalCode?.errors &&
      (this.postalCode?.touched || this.postalCode?.dirty)
    ) {
      if (this.postalCode.errors['required']) {
        return 'Postal Code is required';
      } else if (this.postalCode.value?.length! < 4)
        return 'Postal Code length should be 4';
    }
    return;
  }
  get streetError() {
    if (this.street?.errors && (this.street?.touched || this.street?.dirty)) {
      if (this.street.errors['required']) {
        return 'Street is required';
      }
    }
    return;
  }
  get houseNumberError() {
    if (
      this.houseNumber?.errors &&
      (this.houseNumber?.touched || this.houseNumber?.dirty)
    ) {
      if (this.houseNumber.errors['required']) {
        return 'House Number is required';
      }
    }
    return;
  }

  get invalidAddressError() {
    if (this.invalidAddress) {
      return 'Invalid address';
    }
    return;
  }
}
