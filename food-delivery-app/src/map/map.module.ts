import { Module } from '@nestjs/common';
import { MapController } from './controllers/map/map.controller';
import { MapService } from './services/map/map.service';

@Module({
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
