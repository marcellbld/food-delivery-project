import { AutomapperModule } from '@automapper/nestjs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Category } from './entities/category.model';
import { CategoriesService } from './services/categories/categories.service';
import { CategoriesController } from './controllers/categories/categories.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Category] }),
    AutomapperModule,
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
