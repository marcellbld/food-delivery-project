import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapAddressService {
  constructor(private readonly http: HttpClient) {}

  findAddressByCoordinate(lon: number, lat: number) {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`
    );
  }
  findCoordinateByAddress(
    houseNumber: string,
    street: string,
    postalCode: string
  ) {
    return this.http.get(
      `https://nominatim.openstreetmap.org/search?format=json&street=${houseNumber}%2C+${street}&postalcode=${postalCode}`
    );
  }
}
