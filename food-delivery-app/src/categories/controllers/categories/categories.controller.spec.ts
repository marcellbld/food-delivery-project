import { Test, TestingModule } from '@nestjs/testing';
import * as CategoryMocks from '../../../../test/mocks/category.mock';
import { CategoriesService } from '../../services/categories/categories.service';
import { CategoriesController } from './categories.controller';

describe('UsersController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;

  const createCategoryMock = CategoryMocks.createCategoryMock;

  const primaryCategoriesDtoMock = CategoryMocks.primaryCategoriesDtoMock;
  const secondaryCategoriesDtoMock = CategoryMocks.secondaryCategoriesDtoMock;
  const categoryDtoMock = CategoryMocks.categoryDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            createSecondary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('categoriesService should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('findAllSecondary', () => {
    beforeEach(() => {
      jest
        .spyOn(categoriesService, 'findAll')
        .mockResolvedValue(secondaryCategoriesDtoMock);
    });
    it('should return secondary categories', async () => {
      const categories = await controller.findAllSecondary('filter');

      expect(categories).toEqual(secondaryCategoriesDtoMock);
    });
    it('should call categoriesService.findAll with correct params', async () => {
      await controller.findAllSecondary('filter');
      expect(categoriesService.findAll).toHaveBeenCalledWith(false, 'filter');
    });
  });
  describe('findAllPrimary', () => {
    beforeEach(() => {
      jest
        .spyOn(categoriesService, 'findAll')
        .mockResolvedValue(primaryCategoriesDtoMock);
    });
    it('should return primary categories', async () => {
      const categories = await controller.findAllPrimary();

      expect(categories).toEqual(primaryCategoriesDtoMock);
    });
    it('should call categoriesService.findAll with correct params', async () => {
      await controller.findAllPrimary();
      expect(categoriesService.findAll).toHaveBeenCalledWith(true);
    });
  });
  describe('createSecondary', () => {
    beforeEach(() => {
      jest
        .spyOn(categoriesService, 'createSecondary')
        .mockResolvedValue(categoryDtoMock);
    });
    it('should create category then return as CategoryDto', async () => {
      const category = await controller.createSecondary(createCategoryMock);

      expect(category).toEqual(categoryDtoMock);
    });
    it('should call categoriesService.createSecondary with correct params', async () => {
      await controller.createSecondary(createCategoryMock);

      expect(categoriesService.createSecondary).toHaveBeenCalledWith(
        createCategoryMock,
      );
    });
  });
});
