import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Feature } from 'ol';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { Coordinate } from 'ol/coordinate';
import { Circle as CircleStyle, Icon, Stroke, Style } from 'ol/style';
import { LineString, Point } from 'ol/geom';
import { MapService } from '../../../core/services/map/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnChanges {
  @Input() clickable: boolean | undefined = false;
  @Input() route: boolean | undefined = false;

  @Input() mainCoordinate: Coordinate | number[] | undefined;
  @Output() mainCoordinateChange = new EventEmitter<Coordinate | undefined>();

  @Input() secondaryCoordinate: Coordinate | number[] | undefined;

  @Input() featureIcons: string[] | undefined = ['shop.svg', 'user.svg'];

  features: Feature[] = [];

  vectorSource = new VectorSource();

  map: Map | undefined;

  center = [19.040236, 47.497913];

  routeCoordinates: Coordinate[] | undefined;

  mapId: string = 'map' + Math.floor(Math.random() * 1000000 + 1);

  constructor(private mapService: MapService) {}

  refreshMap(): void {
    setTimeout(() => {
      this.map?.updateSize();

      if (this.mainCoordinate) {
        this.initializeMainFeature(this.mainCoordinate);
      }
      if (this.secondaryCoordinate) {
        this.initializeSecondaryFeature(this.secondaryCoordinate);
      }
    }, 200);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainCoordinate']) {
      const coordinate = changes['mainCoordinate'].currentValue;

      if (coordinate === undefined || coordinate.length === 0) {
        if (this.mainFeature) {
          this.vectorSource.removeFeature(this.mainFeature);
        }
      } else {
        this.initializeMainFeature(coordinate);
      }
    }
    if (changes['secondaryCoordinate']) {
      const coordinate = changes['secondaryCoordinate'].currentValue;

      if (coordinate === undefined || coordinate.length === 0) {
        if (this.secondaryFeature) {
          this.vectorSource.removeFeature(this.secondaryFeature);
        }
      } else {
        this.initializeSecondaryFeature(coordinate);
      }
    }

    if (
      this.route &&
      (changes['mainCoordinate'] || changes['secondaryCoordinate']) &&
      this.mainCoordinate &&
      this.secondaryCoordinate
    ) {
      this.mapService
        .findRoute(this.mainCoordinate, this.secondaryCoordinate)
        .subscribe((result) => {
          this.routeCoordinates = (result as number[][]).map((coordinate) =>
            fromLonLat(coordinate)
          );

          this.initializeRouteFeature(this.routeCoordinates);
        });
    }
  }

  ngOnInit(): void {
    this.initializeMap();

    if (this.mainCoordinate && !this.mainFeature) {
      this.initializeMainFeature(this.mainCoordinate);
    }
    if (this.secondaryCoordinate && !this.secondaryFeature) {
      this.initializeSecondaryFeature(this.secondaryCoordinate);
    }

    setTimeout(() => {
      this.map?.setTarget(this.mapId);
      this.refreshMap();
    }, 500);
  }

  private get mainFeature(): Feature | null {
    return this.vectorSource.getFeatureById('mainFeature');
  }
  private get secondaryFeature(): Feature | null {
    return this.vectorSource.getFeatureById('secondaryFeature');
  }
  private get routeFeature(): Feature | null {
    return this.vectorSource.getFeatureById('routeFeature');
  }

  initializeMainFeature(coordinate: Coordinate) {
    if (!this.mainFeature) {
      const mainFeature = new Feature({
        geometry: new Point(fromLonLat(coordinate)),
      });
      mainFeature.setId('mainFeature');
      mainFeature.setStyle(
        new Style({
          image: new Icon({
            color: '#FFFFFF',
            crossOrigin: 'anonymous',
            src: `assets/${this.featureIcons![0]}`,
          }),
        })
      );

      this.vectorSource.addFeature(mainFeature);

      this.center = fromLonLat(coordinate);

      setTimeout(
        () =>
          this.map?.getView().animate({ center: this.center, duration: 500 }),
        30
      );
    } else {
      if (this.mainFeature) {
        this.vectorSource.removeFeature(this.mainFeature);
        this.initializeMainFeature(coordinate);
      }
    }
  }
  initializeRouteFeature(coordinates: Coordinate[]) {
    if (!this.routeFeature) {
      const routeFeature = new Feature({
        type: 'route',
        geometry: new LineString(coordinates),
      });
      routeFeature.setId('routeFeature');

      routeFeature.setStyle(
        new Style({
          stroke: new Stroke({
            width: 6,
            color: [237, 212, 0, 0.8],
          }),
        })
      );

      this.vectorSource.addFeature(routeFeature);
    } else {
      if (this.routeFeature) {
        this.vectorSource.removeFeature(this.routeFeature);
        this.initializeRouteFeature(coordinates);
      }
    }
  }
  initializeSecondaryFeature(coordinate: Coordinate) {
    if (!this.secondaryFeature) {
      const secondaryFeature = new Feature({
        geometry: new Point(fromLonLat(coordinate)),
      });
      secondaryFeature.setId('secondaryFeature');
      secondaryFeature.setStyle(
        new Style({
          image: new Icon({
            color: '#FFFFFF',
            crossOrigin: 'anonymous',
            src: `assets/${this.featureIcons![1]}`,
          }),
        })
      );

      this.vectorSource.addFeature(secondaryFeature);
    } else {
      if (this.secondaryFeature) {
        this.vectorSource.removeFeature(this.secondaryFeature);
        this.initializeSecondaryFeature(coordinate);
      }
    }
  }

  initializeMap(): void {
    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      zIndex: 1,
    });

    this.map = new Map({
      // target: this.mapId,
      layers: [new TileLayer({ zIndex: 0, source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat(this.center),
        zoom: 16,
        minZoom: 2,
        maxZoom: 19,
      }),
    });
    if (this.clickable) {
      const component = this;
      this.map.on('click', function (evt) {
        component.mainCoordinate = toLonLat(evt.coordinate);
        component.mainCoordinateChange.emit(component.mainCoordinate);
        component.initializeMainFeature(component.mainCoordinate);
      });
    }
  }
}
