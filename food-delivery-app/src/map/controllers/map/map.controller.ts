import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { MapService } from '../../../map/services/map/map.service';
import { UserRole } from '../../../users/user-role';

@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}

  @Get('route')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Courier, UserRole.User, UserRole.Admin)
  async findRoute(
    @Query('slat') startLat,
    @Query('slon') startLon,
    @Query('elat') endLat,
    @Query('elon') endLon,
  ): Promise<number[][]> {
    if (!startLat || !startLon || !endLat || !endLon) {
      throw new BadRequestException(`Latitude or longitude doesn't exists.`);
    }

    return await this.mapService.findRoute(
      [startLat, startLon],
      [endLat, endLon],
    );
  }
}
