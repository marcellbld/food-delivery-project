import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantItemsService } from '../../services/restaurant-items/restaurant-items.service';
import * as RestaurantMocks from '../../../../test/mocks/restaurant.mock';
import * as RestaurantItemMocks from '../../../../test/mocks/restaurant-item.mock';
import * as UserMocks from '../../../../test/mocks/user.mock';
import { RestaurantsService } from '../../services/restaurants/restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { UserRole } from '../../../users/user-role';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let restaurantsService: RestaurantsService;
  let restaurantItemsService: RestaurantItemsService;

  let createRestaurantMock;
  let restaurantDtoMock;
  let restaurantArrayDtoMock;
  let userDtoMock;

  let createRestaurantItemMock;
  let restaurantItemDtoMock;
  let restaurantItemArrayDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findByOwner: jest.fn(),
            findOne: jest.fn(),
            compareOwner: jest.fn(),
            findOneByName: jest.fn(),
          },
        },
        {
          provide: RestaurantItemsService,
          useValue: {
            findAllByRestaurant: jest.fn(),
            findPopularItems: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    restaurantsService = module.get<RestaurantsService>(RestaurantsService);
    restaurantItemsService = module.get<RestaurantItemsService>(
      RestaurantItemsService,
    );
  });

  beforeEach(() => {
    createRestaurantMock = RestaurantMocks.createRestaurantMock();
    restaurantDtoMock = RestaurantMocks.restaurantDtoMock();
    restaurantArrayDtoMock = [
      RestaurantMocks.restaurantDtoMock(),
      RestaurantMocks.restaurant2DtoMock(),
    ];
    userDtoMock = UserMocks.userDtoMock();

    createRestaurantItemMock = RestaurantItemMocks.createRestaurantItemMock();
    restaurantItemDtoMock = RestaurantItemMocks.restaurantItemDtoMock();
    restaurantItemArrayDtoMock = [
      RestaurantItemMocks.restaurantItemDtoMock(),
      RestaurantItemMocks.restaurantItem2DtoMock(),
    ];
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('restaurantsService should be defined', () => {
    expect(restaurantsService).toBeDefined();
  });
  it('restaurantItemsService should be defined', () => {
    expect(restaurantItemsService).toBeDefined();
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantsService, 'findAll')
        .mockResolvedValue(restaurantArrayDtoMock);
    });
    it('should return restaurants', async () => {
      const restaurants = await controller.findAll(0, '');

      expect(restaurants).toEqual(restaurantArrayDtoMock);
    });
    it('should call restaurantsService.findAll with correct params', async () => {
      await controller.findAll(5, '');

      expect(restaurantsService.findAll).toHaveBeenCalledWith(5, '');
    });
  });
  describe('findSelfRestaurants', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantsService, 'findByOwner')
        .mockResolvedValue(restaurantArrayDtoMock);
    });
    it('should return restaurants', async () => {
      const restaurants = await controller.findSelfRestaurants(userDtoMock);

      expect(restaurants).toEqual(restaurantArrayDtoMock);
    });
    it('should call restaurantsService.findByOwner with correct params', async () => {
      await controller.findSelfRestaurants(userDtoMock);

      expect(restaurantsService.findByOwner).toHaveBeenCalledWith(
        userDtoMock.id,
      );
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantsService, 'findOne')
        .mockResolvedValue(restaurantDtoMock);
    });

    it('should return restaurant', async () => {
      const restaurant = await controller.findOne(1);

      expect(restaurant).toEqual(restaurantDtoMock);
    });
    it('should call restaurantsService.findOne with correct params', async () => {
      await controller.findOne(1);

      expect(restaurantsService.findOne).toHaveBeenCalledWith(1);
    });
  });
  describe('create', () => {
    describe('with image', () => {
      beforeEach(() => {
        jest
          .spyOn(restaurantsService, 'create')
          .mockResolvedValue({ ...restaurantDtoMock, image: 'image.jpg' });
      });

      it('should create restaurant then return it (with image)', async () => {
        const restaurant = await controller.create(
          createRestaurantMock,
          userDtoMock,
          { filename: 'image.jpg' } as any,
        );

        expect(restaurant).toEqual({
          ...restaurantDtoMock,
          image: 'image.jpg',
        });
      });

      it('should call restaurantsService.create with correct params', async () => {
        await controller.create(createRestaurantMock, userDtoMock, {
          filename: 'image.jpg',
        } as any);

        expect(restaurantsService.create).toHaveBeenCalledWith({
          ...createRestaurantMock,
          owner: userDtoMock.id,
          image: 'image.jpg',
        });
      });
    });
    describe('without image', () => {
      beforeEach(() => {
        jest
          .spyOn(restaurantsService, 'create')
          .mockResolvedValue(restaurantDtoMock);
      });

      it('should create restaurant then return it', async () => {
        const restaurant = await controller.create(
          createRestaurantMock,
          userDtoMock,
          null,
        );

        expect(restaurant).toEqual(restaurantDtoMock);
      });
      it('should call restaurantsService.create with correct params', async () => {
        await controller.create(createRestaurantMock, userDtoMock, null);

        expect(restaurantsService.create).toHaveBeenCalledWith({
          ...createRestaurantMock,
          owner: userDtoMock.id,
          image: null,
        });
      });
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(restaurantsService, 'update').mockResolvedValue({
        ...restaurantDtoMock,
        description: 'Updated Description',
      });
    });

    it('should update then return it (sent as Admin)', async () => {
      const restaurant = await controller.update(
        restaurantDtoMock.id,
        {
          description: 'Updated Description',
        },
        { ...userDtoMock, role: UserRole.Admin },
        null,
      );

      expect(restaurant).toEqual({
        ...restaurantDtoMock,
        description: 'Updated Description',
      });
    });
    it('should update then return it (sent as owner of restaurant)', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      const restaurant = await controller.update(
        restaurantDtoMock.id,
        {
          description: 'Updated Description',
        },
        userDtoMock,
        null,
      );

      expect(restaurant).toEqual({
        ...restaurantDtoMock,
        description: 'Updated Description',
      });
    });
    it('should call restaurantsService.update with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.update(
        restaurantDtoMock.id,
        {
          description: 'Updated Description',
        },
        userDtoMock,
        null,
      );

      expect(restaurantsService.update).toHaveBeenCalledWith(
        restaurantDtoMock.id,
        {
          description: 'Updated Description',
        },
        null,
      );
    });
    it('should call restaurantsService.compareOwner with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.update(
        restaurantDtoMock.id,
        {
          description: 'Updated Description',
        },
        userDtoMock,
        null,
      );

      expect(restaurantsService.compareOwner).toHaveBeenCalledWith(
        userDtoMock.id,
        restaurantDtoMock.id,
      );
    });
    it('should throw ForbiddenException if user is not owner of restaurant', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(false);

      await expect(
        controller.update(
          restaurantDtoMock.id,
          {
            description: 'Updated Description',
          },
          { ...userDtoMock },
          null,
        ),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      jest.spyOn(restaurantsService, 'delete').mockResolvedValue(true);
    });

    it('should delete restaurant and return true (sent as Admin)', async () => {
      const result = await controller.delete(1, {
        ...userDtoMock,
        role: UserRole.Admin,
      });

      expect(result).toBeTruthy();
    });
    it('should delete restaurant and return true (sent as owner of Restaurant)', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      const result = await controller.delete(1, userDtoMock);

      expect(result).toBeTruthy();
    });
    it('should call restaurantsService.delete with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.delete(1, userDtoMock);

      expect(restaurantsService.delete).toHaveBeenCalledWith(1);
    });
    it('should call restaurantsService.compareOwner with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.delete(1, userDtoMock);

      expect(restaurantsService.compareOwner).toHaveBeenCalledWith(
        userDtoMock.id,
        1,
      );
    });
    it('should throw ForbiddenException if user is not owner of restaurant', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(false);

      await expect(controller.delete(1, userDtoMock)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
  describe('findAllItemsByRestaurant', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemsService, 'findAllByRestaurant')
        .mockResolvedValue(restaurantItemArrayDtoMock);
    });

    it('should return items', async () => {
      const items = await controller.findAllItemsByRestaurant(1);

      expect(items).toEqual(restaurantItemArrayDtoMock);
    });
    it('should call restaurantItemsService.findAllByRestaurant with correct params', async () => {
      await controller.findAllItemsByRestaurant(5);

      expect(restaurantItemsService.findAllByRestaurant).toHaveBeenCalledWith(
        5,
      );
    });
  });
  describe('findPopularItemsByRestaurant', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemsService, 'findPopularItems')
        .mockResolvedValue(restaurantItemArrayDtoMock);
    });

    it('should return items', async () => {
      const items = await controller.findPopularItemsByRestaurant(1);

      expect(items).toEqual(restaurantItemArrayDtoMock);
    });
    it('should call restaurantItemsService.findPopularItems with correct params', async () => {
      await controller.findPopularItemsByRestaurant(5);

      expect(restaurantItemsService.findPopularItems).toHaveBeenCalledWith(5);
    });
  });
  describe('createItem', () => {
    beforeEach(() => {
      jest
        .spyOn(restaurantItemsService, 'create')
        .mockResolvedValue(restaurantItemDtoMock);
    });
    describe('without image', () => {
      it('should create item (sent as Admin)', async () => {
        const item = await controller.createItem(
          restaurantDtoMock.id,
          createRestaurantItemMock,
          { ...userDtoMock, role: UserRole.Admin },
          null,
        );

        expect(item).toEqual(restaurantItemDtoMock);
      });
      it('should create item (sent as Owner of restaurant)', async () => {
        restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

        const item = await controller.createItem(
          restaurantDtoMock.id,
          createRestaurantItemMock,
          userDtoMock,
          null,
        );

        expect(item).toEqual(restaurantItemDtoMock);
      });

      it('should call restaurantItemsService.create with correct params', async () => {
        restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

        await controller.createItem(
          restaurantDtoMock.id,
          createRestaurantItemMock,
          userDtoMock,
          null,
        );

        expect(restaurantItemsService.create).toHaveBeenCalledWith(
          restaurantDtoMock.id,
          {
            ...createRestaurantItemMock,
            image: null,
          },
        );
      });
      it('should call restaurantsService.compareOwner with correct params', async () => {
        restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

        await controller.createItem(
          restaurantDtoMock.id,
          createRestaurantItemMock,
          userDtoMock,
          null,
        );

        expect(restaurantsService.compareOwner).toHaveBeenCalledWith(
          userDtoMock.id,
          restaurantDtoMock.id,
        );
      });
      it('should throw ForbiddenException if user is not owner of restaurant', async () => {
        restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(false);

        await expect(
          controller.createItem(
            restaurantDtoMock.id,
            createRestaurantItemMock,
            userDtoMock,
            null,
          ),
        ).rejects.toThrowError(ForbiddenException);
      });
    });
    describe('with image', () => {
      it('should call restaurantItemsService.create with correct params', async () => {
        restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

        await controller.createItem(
          restaurantDtoMock.id,
          createRestaurantItemMock,
          userDtoMock,
          { filename: 'image.jpg' } as any,
        );

        expect(restaurantItemsService.create).toHaveBeenCalledWith(
          restaurantDtoMock.id,
          {
            ...createRestaurantItemMock,
            image: 'image.jpg',
          },
        );
      });
    });
  });
  describe('deleteItem', () => {
    beforeEach(() => {
      jest.spyOn(restaurantItemsService, 'delete').mockResolvedValue(true);
    });
    it('should delete item (sent as Admin)', async () => {
      const result = await controller.deleteItem(
        restaurantDtoMock.id,
        { ...userDtoMock, role: UserRole.Admin },
        restaurantItemDtoMock.id,
      );

      expect(result).toBeTruthy();
    });
    it('should create item (sent as Owner of restaurant)', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);
      const result = await controller.deleteItem(
        restaurantDtoMock.id,
        userDtoMock,
        restaurantItemDtoMock.id,
      );

      expect(result).toBeTruthy();
    });

    it('should call restaurantItemsService.delete with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.deleteItem(
        restaurantDtoMock.id,
        userDtoMock,
        restaurantItemDtoMock.id,
      );

      expect(restaurantItemsService.delete).toHaveBeenCalledWith(
        restaurantItemDtoMock.id,
      );
    });
    it('should call restaurantsService.compareOwner with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.deleteItem(
        restaurantDtoMock.id,
        userDtoMock,
        restaurantItemDtoMock.id,
      );

      expect(restaurantsService.compareOwner).toHaveBeenCalledWith(
        userDtoMock.id,
        restaurantDtoMock.id,
      );
    });
    it('should throw ForbiddenException if user is not owner of restaurant', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(false);

      await expect(
        controller.deleteItem(
          restaurantDtoMock.id,
          userDtoMock,
          restaurantItemDtoMock.id,
        ),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
  describe('updateItem', () => {
    let updatedItem;
    beforeEach(() => {
      updatedItem = {
        ...restaurantItemDtoMock,
        name: 'Updated Name',
        description: 'Updated Description',
        price: 99.99,
      };

      jest
        .spyOn(restaurantItemsService, 'update')
        .mockResolvedValue(updatedItem);
    });
    it('should update item (sent as Admin)', async () => {
      const item = await controller.updateItem(
        restaurantDtoMock.id,
        {
          id: restaurantItemDtoMock.id,
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        { ...userDtoMock, role: UserRole.Admin },
        null,
      );

      expect(item).toEqual(updatedItem);
    });
    it('should update item (sent as Owner of restaurant)', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);
      const item = await controller.updateItem(
        restaurantDtoMock.id,
        {
          id: restaurantItemDtoMock.id,
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        userDtoMock,
        null,
      );

      expect(item).toEqual(updatedItem);
    });

    it('should call restaurantItemsService.update with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.updateItem(
        restaurantDtoMock.id,
        {
          id: restaurantItemDtoMock.id,
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        userDtoMock,
        null,
      );

      expect(restaurantItemsService.update).toHaveBeenCalledWith(
        {
          id: restaurantItemDtoMock.id,
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        null,
      );
    });
    it('should call restaurantsService.compareOwner with correct params', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(true);

      await controller.updateItem(
        restaurantDtoMock.id,
        {
          id: restaurantItemDtoMock.id,
          name: 'Updated Name',
          description: 'Updated Description',
          price: '99.99',
        },
        userDtoMock,
        null,
      );

      expect(restaurantsService.compareOwner).toHaveBeenCalledWith(
        userDtoMock.id,
        restaurantDtoMock.id,
      );
    });
    it('should throw ForbiddenException if user is not owner of restaurant', async () => {
      restaurantsService.compareOwner = jest.fn().mockReturnValueOnce(false);

      await expect(
        controller.updateItem(
          restaurantDtoMock.id,
          {
            id: restaurantItemDtoMock.id,
            name: 'Updated Name',
            description: 'Updated Description',
            price: '99.99',
          },
          userDtoMock,
          null,
        ),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
  describe('isRestaurantNameTaken', () => {
    it("should return false if restaurant doesn't exists", async () => {
      restaurantsService.findOneByName = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new NotFoundException();
        });

      const result = await controller.isRestaurantNameTaken('name');
      expect(result).toBeFalsy();
    });
    it('should return true if restaurant exists', async () => {
      restaurantsService.findOneByName = jest.fn().mockReturnValueOnce({});

      const result = await controller.isRestaurantNameTaken('name');
      expect(result).toBeTruthy();
    });
    it('should call restaurantsService.findOneByName with correct params', async () => {
      restaurantsService.findOneByName = jest.fn().mockReturnValueOnce(null);

      await controller.isRestaurantNameTaken('name');
      expect(restaurantsService.findOneByName).toHaveBeenCalledWith('name');
    });
  });
});
