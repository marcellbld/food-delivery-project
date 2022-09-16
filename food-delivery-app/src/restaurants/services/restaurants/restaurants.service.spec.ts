import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Restaurant } from '../../entities/restaurant.model';
import { RestaurantsService } from './restaurants.service';
import { Category } from '../../../categories/entities/category.model';
import * as RestaurantMocks from '../../../../test/mocks/restaurant.mock';
import { MainAutomapperProfile } from '../../../main.automapper-profile';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let restaurantRepository: EntityRepository<Restaurant>;
  let categoryRepository: EntityRepository<Category>;

  const RESTAURANT_REPOSITORY_TOKEN = getRepositoryToken(Restaurant);
  const CATEGORY_REPOSITORY_TOKEN = getRepositoryToken(Category);

  let restaurantMock;
  let restaurantDtoMock;
  let restaurant2Mock;
  let restaurant2DtoMock;
  let createRestaurantMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        MainAutomapperProfile,
        RestaurantsService,
        {
          provide: RESTAURANT_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn(),
          },
        },
        {
          provide: CATEGORY_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    restaurantRepository = module.get<EntityRepository<Restaurant>>(
      RESTAURANT_REPOSITORY_TOKEN,
    );
    categoryRepository = module.get<EntityRepository<Category>>(
      CATEGORY_REPOSITORY_TOKEN,
    );
  });

  beforeEach(() => {
    restaurantMock = RestaurantMocks.restaurantMock();
    restaurantDtoMock = RestaurantMocks.restaurantDtoMock();
    restaurant2Mock = RestaurantMocks.restaurant2Mock();
    restaurant2DtoMock = RestaurantMocks.restaurant2DtoMock();
    createRestaurantMock = RestaurantMocks.createRestaurantMock();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Restaurant Repository should be defined', () => {
    expect(restaurantRepository).toBeDefined();
  });
  it('Category Repository should be defined', () => {
    expect(categoryRepository).toBeDefined();
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'find')
        .mockResolvedValue([restaurantMock, restaurant2Mock]);
    });

    it('should return all restaurants as RestaurantDto', async () => {
      const restaurants = await service.findAll(0, '');

      expect(restaurants).toEqual([restaurantDtoMock, restaurant2DtoMock]);
    });
    it('should call restaurantRepository.find with correct params', async () => {
      const skip = 10;
      await service.findAll(skip, '');
      expect(restaurantRepository.find).toHaveBeenCalledWith(
        {
          name: { $like: '%%' },
        },
        {
          populate: ['categories'],
          limit: 10,
          offset: skip,
        },
      );
    });
  });
  describe('findByOwner', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'find')
        .mockResolvedValue([restaurantMock, restaurant2Mock]);
    });

    it('should return all restaurants and return as RestaurantDto', async () => {
      const restaurants = await service.findByOwner(1);

      expect(restaurants).toEqual([restaurantDtoMock, restaurant2DtoMock]);
    });
    it('should call restaurantRepository.find with correct params', async () => {
      await service.findByOwner(1);

      expect(restaurantRepository.find).toHaveBeenCalledWith(
        { owner: 1 },
        { populate: ['categories'] },
      );
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurantMock);
    });

    it('should find restaurant and return as RestaurantDto', async () => {
      const restaurant = await service.findOne(1);

      expect(restaurant).toEqual(restaurantDtoMock);
    });

    it('should call restaurantRepository.findOne with correct params', async () => {
      await service.findOne(1);

      expect(restaurantRepository.findOne).toHaveBeenCalledWith(1, {
        populate: ['categories'],
      });
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });
  describe('findOneByName', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurantMock);
    });

    it('should find restaurant and return as RestaurantDto', async () => {
      const restaurant = await service.findOneByName('Test Restaurant');

      expect(restaurant).toEqual(restaurantDtoMock);
    });

    it('should call restaurantRepository.findOne with correct params', async () => {
      await service.findOneByName('Test Restaurant');

      expect(restaurantRepository.findOne).toHaveBeenCalledWith(
        { name: 'Test Restaurant' },
        {
          populate: ['categories'],
        },
      );
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.findOneByName('Test Restaurant'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'create')
        .mockReturnValue(restaurantMock);
    });

    it('should create restaurant and return as RestaurantDto', async () => {
      const restaurant = await service.create(createRestaurantMock);

      expect(restaurant).toEqual(restaurantDtoMock);
    });

    it('should call restaurantRepository.create with correct params', async () => {
      await service.create(createRestaurantMock);

      expect(restaurantRepository.create).toHaveBeenCalledWith(
        createRestaurantMock,
      );
    });
    it('should call restaurantRepository.persistAndFlush with correct params', async () => {
      await service.create(createRestaurantMock);

      expect(restaurantRepository.persistAndFlush).toHaveBeenCalledWith(
        restaurantMock,
      );
    });
    it('should throw BadRequestException if restaurant cannot be created', async () => {
      restaurantRepository.create = jest
        .fn()
        .mockImplementationOnce((_: any) => {
          throw new BadRequestException();
        });

      await expect(service.create(createRestaurantMock)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurantMock);
    });

    it('should find restaurant and update then return as RestaurantDto', async () => {
      const restaurant = await service.update(
        1,
        {
          description: 'New Description',
        },
        null,
      );

      expect(restaurant).toEqual({
        ...restaurantDtoMock,
        description: 'New Description',
      });
    });
    it('should call restaurantRepository.findOne with correct params', async () => {
      await service.update(
        1,
        {
          description: 'New Description',
        },
        null,
      );

      expect(restaurantRepository.findOne).toHaveBeenCalledWith(
        { id: 1 },
        { populate: ['categories'] },
      );
    });
    it('should call restaurantRepository.persistAndFlush with correct params', async () => {
      await service.update(
        1,
        {
          description: 'New Description',
        },
        null,
      );

      expect(restaurantRepository.persistAndFlush).toHaveBeenCalledWith({
        ...restaurantMock,
        description: 'New Description',
      });
    });
    it("should throw BadRequestException if restaurant doesn't exists", async () => {
      restaurantRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.update(
          1,
          {
            description: 'New Description',
          },
          null,
        ),
      ).rejects.toThrowError(BadRequestException);
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurantMock);
    });

    it('should find restaurant and delete then return true', async () => {
      const result = await service.delete(1);

      expect(result).toBeTruthy();
    });
    it('should call restaurantRepository.findOne with correct params', async () => {
      await service.delete(1);

      expect(restaurantRepository.findOne).toHaveBeenCalledWith(
        { id: 1 },
        { populate: ['items'] },
      );
    });

    it('should call restaurantRepository.removeAndFlush with correct params', async () => {
      await service.delete(1);

      expect(restaurantRepository.removeAndFlush).toHaveBeenCalledWith(
        restaurantMock,
      );
    });
    it("should throw BadRequestException if restaurant doesn't exists", async () => {
      restaurantRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('compareOwner', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurantMock);
    });

    it('should find restaurant and return true if owner belongs to restaurant', async () => {
      const result = await service.compareOwner(1, 1);

      expect(result).toBeTruthy();
    });
    it("should find restaurant and return false if owner doesn't belong to restaurant", async () => {
      const result = await service.compareOwner(2, 1);

      expect(result).toBeFalsy();
    });
    it('should call restaurantRepository.findOne with correct params', async () => {
      await service.compareOwner(2, 1);

      expect(restaurantRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    });
    it("should throw BadRequestException if restaurant doesn't exists", async () => {
      restaurantRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.compareOwner(2, 1)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
