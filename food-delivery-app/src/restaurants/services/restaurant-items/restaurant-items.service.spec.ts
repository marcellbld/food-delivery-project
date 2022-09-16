import { Test, TestingModule } from '@nestjs/testing';
import { Restaurant } from '../../entities/restaurant.model';
import { RestaurantItem } from '../../entities/restaurant-item.model';
import { RestaurantItemsService } from './restaurant-items.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import * as RestaurantMocks from '../../../../test/mocks/restaurant.mock';
import * as RestaurantItemMocks from '../../../../test/mocks/restaurant-item.mock';
import { MainAutomapperProfile } from '../../../main.automapper-profile';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RestaurantItemsService', () => {
  let service: RestaurantItemsService;
  let restaurantItemRepository: EntityRepository<RestaurantItem>;

  const RESTAURANT_ITEM_REPOSITORY_TOKEN = getRepositoryToken(RestaurantItem);

  let restaurantMock;
  let createRestaurantItemMock;
  let restaurantItemMock;
  let restaurantItemDtoMock;
  let restaurantItemArrayMock;
  let restaurantItemArrayDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        MainAutomapperProfile,
        RestaurantItemsService,
        {
          provide: RESTAURANT_ITEM_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantItemsService>(RestaurantItemsService);
    restaurantItemRepository = module.get<EntityRepository<RestaurantItem>>(
      RESTAURANT_ITEM_REPOSITORY_TOKEN,
    );
  });

  beforeEach(() => {
    restaurantMock = RestaurantMocks.restaurantMock();
    createRestaurantItemMock = RestaurantItemMocks.createRestaurantItemMock();
    restaurantItemMock = RestaurantItemMocks.restaurantItemMock();
    restaurantItemDtoMock = RestaurantItemMocks.restaurantItemDtoMock();
    restaurantItemArrayMock = [
      RestaurantItemMocks.restaurantItemMock(),
      RestaurantItemMocks.restaurantItem2Mock(),
    ];
    restaurantItemArrayDtoMock = [
      RestaurantItemMocks.restaurantItemDtoMock(),
      RestaurantItemMocks.restaurantItem2DtoMock(),
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('RestaurantItemRepository should be defined', () => {
    expect(restaurantItemRepository).toBeDefined();
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemRepository, 'findOne')
        .mockResolvedValue(restaurantItemMock);
    });

    it('should return a restaurant item as RestaurantItemDto', async () => {
      const restaurantItem = await service.findOne(restaurantItemMock.id);
      expect(restaurantItem).toEqual(restaurantItemDtoMock);
    });
    it('should call restaurantItemRepository.findOne with correct params', async () => {
      await service.findOne(restaurantItemMock.id);

      expect(restaurantItemRepository.findOne).toHaveBeenCalledWith({
        id: restaurantItemMock.id,
      });
    });
    it("should throw BadRequestException when restaurant item doesn't exists", async () => {
      restaurantItemRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });
  describe('findAllByRestaurant', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemRepository, 'find')
        .mockResolvedValue(restaurantItemArrayMock);
    });

    it('should return restaurant items as RestaurantItemDto', async () => {
      const restaurantItems = await service.findAllByRestaurant(
        restaurantMock.id,
      );
      expect(restaurantItems).toEqual(restaurantItemArrayDtoMock);
    });
    it('should call restaurantItemRepository.find with correct params', async () => {
      await service.findAllByRestaurant(restaurantMock.id);

      expect(restaurantItemRepository.find).toHaveBeenCalledWith({
        restaurant: { id: restaurantMock.id },
      });
    });
  });
  describe('findPopularItems', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemRepository, 'find')
        .mockResolvedValue(restaurantItemArrayMock);
    });

    it('should return items as RestaurantItemDto', async () => {
      const restaurantItems = await service.findPopularItems(restaurantMock.id);
      expect(restaurantItems).toEqual(restaurantItemArrayDtoMock);
    });
    it('should call restaurantItemRepository.find with correct params', async () => {
      await service.findPopularItems(restaurantMock.id);

      expect(restaurantItemRepository.find).toHaveBeenCalledWith(
        {
          restaurant: { id: restaurantMock.id },
        },
        { limit: 5 },
      );
    });
  });
  describe('create', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemRepository, 'create')
        .mockReturnValue(restaurantItemMock);
      jest
        .spyOn(restaurantItemRepository, 'findOne')
        .mockReturnValue(restaurantItemMock);
    });
    it('should create restaurant item and return as RestaurantItemDto', async () => {
      const item = await service.create(
        restaurantMock.id,
        createRestaurantItemMock,
      );

      expect(item).toEqual(restaurantItemDtoMock);
    });
    it('should call restaurantItemRepository.create with correct params', async () => {
      await service.create(restaurantMock.id, createRestaurantItemMock);

      expect(restaurantItemRepository.create).toHaveBeenCalledWith({
        ...createRestaurantItemMock,
        price: parseFloat(createRestaurantItemMock.price),
        restaurant: restaurantMock.id,
      });
    });
    it('should call restaurantItemRepository.findOne with correct params', async () => {
      await service.create(restaurantMock.id, createRestaurantItemMock);

      expect(restaurantItemRepository.findOne).toHaveBeenCalledWith(
        restaurantItemDtoMock.id,
        {
          populate: ['restaurant'],
        },
      );
    });
    it('should call restaurantItemRepository.persistAndFlush with correct params', async () => {
      await service.create(restaurantMock.id, createRestaurantItemMock);

      expect(restaurantItemRepository.persistAndFlush).toHaveBeenCalledWith({
        ...restaurantItemMock,
        price: parseFloat(createRestaurantItemMock.price),
      });
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemRepository, 'findOne')
        .mockReturnValue(restaurantItemMock);
    });
    it('should find item, update then return as RestaurantItemDto', async () => {
      const item = await service.update(
        {
          id: '1',
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        null,
      );

      expect(item).toEqual({
        ...restaurantItemDtoMock,
        name: 'Updated Name',
        description: 'Updated Description',
        price: 99.99,
      });
    });
    it('should call restaurantItemRepository.findOne with correct params', async () => {
      await service.update(
        {
          id: '1',
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        null,
      );

      expect(restaurantItemRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    });
    it('should call restaurantItemRepository.persistAndFlush with correct params', async () => {
      await service.update(
        {
          id: '1',
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        null,
      );

      expect(restaurantItemRepository.persistAndFlush).toHaveBeenCalledWith({
        ...restaurantItemMock,
        name: 'Updated Name',
        description: 'Updated Description',
        price: 99.99,
      });
    });
    it("should throw BadRequestException if item doesn't exists", async () => {
      restaurantItemRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.update(
          {
            id: '1',
            name: 'Updated Name',
            description: 'Updated Description',
            price: '99.99',
          },
          null,
        ),
      ).rejects.toThrowError(BadRequestException);
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemRepository, 'findOne')
        .mockReturnValue(restaurantItemMock);
    });
    it('should find item, remove then return true', async () => {
      const result = await service.delete(1);

      expect(result).toBeTruthy();
    });
    it('should call restaurantItemRepository.findOne with correct params', async () => {
      await service.delete(1);

      expect(restaurantItemRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    });
    it('should call restaurantItemRepository.removeAndFlush with correct params', async () => {
      await service.delete(1);

      expect(restaurantItemRepository.removeAndFlush).toHaveBeenCalledWith(
        restaurantItemMock,
      );
    });
    it("should throw BadRequestException if item doesn't exists", async () => {
      restaurantItemRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrowError(BadRequestException);
    });
  });
});
