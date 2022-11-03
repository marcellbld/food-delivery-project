import { Coordinate } from 'ol/coordinate';

export interface MapModalEvent {
  mainCoordinate?: Coordinate;
  secondaryCoordinate?: Coordinate;
  route?: boolean;
}
