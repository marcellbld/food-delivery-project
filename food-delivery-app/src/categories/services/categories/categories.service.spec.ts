import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../../entities/category.model';
import { CategoriesService } from './categories.service';
import * as CategoryMocks from '../../../../test/mocks/category.mock';
import { MainAutomapperProfile } from '../../../main.automapper-profile';
import { BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: EntityRepository<Category>;

  const CATEGORY_REPOSITORY_TOKEN = getRepositoryToken(Category);

  const primaryCategoriesMock = CategoryMocks.primaryCategoriesMock;
  const secondaryCategoriesMock = CategoryMocks.secondaryCategoriesMock;
  const createCategoryMock = CategoryMocks.createCategoryMock;
  const categoryMock = CategoryMocks.categoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],

      providers: [
        MainAutomapperProfile,
        CategoriesService,
        {
          provide: CATEGORY_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<EntityRepository<Category>>(
      CATEGORY_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Category Repository should be defined', () => {
    expect(categoryRepository).toBeDefined();
  });

  describe('findAll', () => {
    const setup = (primary: boolean) => {
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(
          primary ? primaryCategoriesMock : secondaryCategoriesMock,
        );
    };

    it('should return all primary categories as CategoryDto', async () => {
      setup(true);

      const categories = await service.findAll(true);
      expect(categories).toEqual([
        {
          id: 1,
          name: 'Primary 1',
          primary: true,
        },
        {
          id: 2,
          name: 'Primary 2',
          primary: true,
        },
        {
          id: 3,
          name: 'Primary 3',
          primary: true,
        },
      ]);
    });
    it('should return all secondary categories as CategoryDto', async () => {
      setup(false);

      const categories = await service.findAll(false);
      expect(categories).toEqual([
        {
          id: 4,
          name: 'Secondary 1',
          primary: true,
        },
        {
          id: 5,
          name: 'Secondary 2',
          primary: true,
        },
        {
          id: 6,
          name: 'Secondary 3',
          primary: true,
        },
      ]);
    });
    it("should call categoryRepository.find with correctParams when nameFilter wasn't given", async () => {
      setup(true);

      await service.findAll(true);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        primary: true,
        name: { $like: `%%` },
      });
    });
    it('should call categoryRepository.find with correctParams when nameFilter was given', async () => {
      setup(false);

      await service.findAll(false, 'filter');

      expect(categoryRepository.find).toHaveBeenCalledWith({
        primary: false,
        name: { $like: `%filter%` },
      });
    });
  });
  describe('createSecondary', () => {
    beforeEach(() => {
      jest.spyOn(categoryRepository, 'create').mockReturnValue(categoryMock);
      jest.spyOn(categoryRepository, 'findOne').mockReturnValue(null);
    });
    it('should create secondary category and return as CategoryDto', async () => {
      const category = await service.createSecondary(createCategoryMock);
      expect(category).toEqual({
        id: 7,
        name: 'New Category',
        primary: false,
      });
    });
    it('should call categoryRepository.create with correct params', async () => {
      await service.createSecondary(createCategoryMock);

      expect(categoryRepository.create).toHaveBeenCalledWith({
        ...createCategoryMock,
        primary: false,
      });
    });
    it('should call categoryRepository.persistAndFlush with correct params', async () => {
      await service.createSecondary(createCategoryMock);

      expect(categoryRepository.persistAndFlush).toHaveBeenCalledWith(
        categoryMock,
      );
    });
    it('should call categoryRepository.findOne with correct params', async () => {
      await service.createSecondary(createCategoryMock);

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        name: createCategoryMock.name,
      });
    });
    it('should throw BadRequestException if category name already exists', async () => {
      categoryRepository.findOne = jest.fn().mockReturnValueOnce({});

      await expect(
        service.createSecondary(createCategoryMock),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
