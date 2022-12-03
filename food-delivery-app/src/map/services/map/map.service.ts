import { BadRequestException, Injectable } from '@nestjs/common';
import * as arcgisRest from '@esri/arcgis-rest-routing';

@Injectable()
export class MapService {
  key = process.env.ARCGIS_KEY;

  async findRoute(
    start: [number, number],
    end: [number, number],
  ): Promise<number[][]> {
    return arcgisRest
      .solveRoute({
        stops: [start, end],
        authentication: this.key,
      })
      .then((response) => {
        const coordinates = (response.routes.geoJson as any).features[0]
          .geometry.coordinates as number[][];

        return coordinates;
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
