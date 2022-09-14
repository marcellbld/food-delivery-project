import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { CategoryDto } from '../../dto/category.dto';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { CategoriesService } from '../../services/categories/categories.service';
import { UserRole } from '../../../users/user-role';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('secondaries/:nameFilter')
  async findAllSecondary(
    @Param('nameFilter') nameFilter: string,
  ): Promise<CategoryDto[]> {
    return this.categoriesService.findAll(false, nameFilter);
  }
  @Get('primaries')
  async findAllPrimary(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll(true);
  }

  @Post('secondaries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @UsePipes(ValidationPipe)
  async createSecondary(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.createSecondary(createCategoryDto);
  }
}
