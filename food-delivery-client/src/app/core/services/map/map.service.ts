import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private readonly http: HttpClient) {}

  findRoute(start: Coordinate, end: Coordinate): Observable<number[][]> {
    return this.http.get<number[][]>(
      `/api/map/route?slat=${start[0]}&slon=${start[1]}&elat=${end[0]}&elon=${end[1]}`
    );
  }
}
