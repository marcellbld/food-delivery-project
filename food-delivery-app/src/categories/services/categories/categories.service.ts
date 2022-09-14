import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryDto } from '../../dto/category.dto';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { Category } from '../../entities/category.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}

  async findAll(primary: boolean, nameFilter = ''): Promise<CategoryDto[]> {
    return this.mapper.mapArrayAsync(
      await this.categoryRepository.find({
        primary,
        name: { $like: `%${nameFilter}%` },
      }),
      Category,
      CategoryDto,
    );
  }

  async createSecondary(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const foundCategory = await this.categoryRepository.findOne({
      name: createCategoryDto.name,
    });
    if (foundCategory)
      throw new BadRequestException('Category already exists with this name.');

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      primary: false,
    });
    await this.categoryRepository.persistAndFlush(category);

    return this.mapper.map(category, Category, CategoryDto);
  }
}
