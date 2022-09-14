import { CartItemsService } from '../../services/cart-item/cart-items.service';
import { CartsService } from '../../services/cart/carts.service';
import { RestaurantItemsService } from '../../../restaurants/services/restaurant-items/restaurant-items.service';
import { CartController } from './cart.controller';
import * as CartMocks from '../../../../test/mocks/cart.mock';
import * as CartItemMocks from '../../../../test/mocks/cart-item.mock';
import * as RestaurantItemMocks from '../../../../test/mocks/restaurant-item.mock';
import * as UserMocks from '../../../../test/mocks/user.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../../users/user-role';

describe('CartController', () => {
  let controller: CartController;
  let cartsService: CartsService;
  let cartItemsService: CartItemsService;
  let restaurantItemsService: RestaurantItemsService;

  let cartMock;
  let purchasedCartMock;
  let purchasedCart2Mock;

  let cartDtoMock;
  let purchasedCartDtoMock;
  let purchasedCart2DtoMock;

  let userDtoMock;

  let cartItemMock;
  let cartItem2Mock;

  let cartItemDtoMock;
  let cartItem2DtoMock;

  let restaurantItemDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartsService,
          useValue: {
            findUnpurchasedByUserId: jest.fn(),
            findAllPurchasedByUserId: jest.fn(),
            findOne: jest.fn(),
            setPurchased: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: CartItemsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: RestaurantItemsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartsService = module.get<CartsService>(CartsService);
    cartItemsService = module.get<CartItemsService>(CartItemsService);
    restaurantItemsService = module.get<RestaurantItemsService>(
      RestaurantItemsService,
    );
  });

  beforeEach(() => {
    cartMock = CartMocks.cartMock();
    cartDtoMock = CartMocks.cartDtoMock();
    purchasedCartMock = CartMocks.purchasedCartMock();
    purchasedCart2Mock = CartMocks.purchasedCart2Mock();
    purchasedCartDtoMock = CartMocks.purchasedCartDtoMock();
    purchasedCart2DtoMock = CartMocks.purchasedCart2DtoMock();

    cartItemMock = CartItemMocks.cartItemMock();
    cartItem2Mock = CartItemMocks.cartItem2Mock();
    cartItemDtoMock = CartItemMocks.cartItemDtoMock();
    cartItem2DtoMock = CartItemMocks.cartItem2DtoMock();

    userDtoMock = UserMocks.userDtoMock();

    restaurantItemDtoMock = RestaurantItemMocks.restaurantItemDtoMock();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('cartsService should be defined', () => {
    expect(cartsService).toBeDefined();
  });
  it('cartItemsService should be defined', () => {
    expect(cartItemsService).toBeDefined();
  });
  it('restaurantItemsService should be defined', () => {
    expect(restaurantItemsService).toBeDefined();
  });

  describe('findUnpurchasedByUser', () => {
    beforeEach(() => {
      jest
        .spyOn(cartsService, 'findUnpurchasedByUserId')
        .mockReturnValue(cartDtoMock);
    });

    it('should return cart', async () => {
      const cart = await controller.findUnpurchasedByUser(userDtoMock);
      expect(cart).toEqual(cartDtoMock);
    });
    it('should call cartsService.findUnpurchasedByUserId with correct params', async () => {
      await controller.findUnpurchasedByUser(userDtoMock);
      expect(cartsService.findUnpurchasedByUserId).toHaveBeenCalledWith(
        userDtoMock.id,
      );
    });
  });
  describe('findAllPurchasedByUser', () => {
    beforeEach(() => {
      return jest
        .spyOn(cartsService, 'findAllPurchasedByUserId')
        .mockResolvedValue([purchasedCartDtoMock, purchasedCart2DtoMock]);
    });

    it('should return carts', async () => {
      const carts = await controller.findAllPurchasedByUser(userDtoMock);
      expect(carts).toEqual([purchasedCartDtoMock, purchasedCart2DtoMock]);
    });

    it('should call cartsService.findAllPurchasedByUserId with correct params', async () => {
      await controller.findAllPurchasedByUser(userDtoMock);
      expect(cartsService.findAllPurchasedByUserId).toHaveBeenCalledWith(
        userDtoMock.id,
      );
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      return jest.spyOn(cartsService, 'findOne').mockResolvedValue(cartDtoMock);
    });

    it('should return cart (get as owner of cart)', async () => {
      const cart = await controller.findOne(1, userDtoMock);
      expect(cart).toEqual(cartDtoMock);
    });

    it('should return cart (get as Admin)', async () => {
      const cart = await controller.findOne(1, {
        ...userDtoMock,
        role: UserRole.Admin,
      });
      expect(cart).toEqual(cartDtoMock);
    });

    it('should call cartsService.findOne with correct params', async () => {
      await controller.findOne(1, userDtoMock);
      expect(cartsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not owner of cart', async () => {
      await expect(
        controller.findOne(1, { ...userDtoMock, id: 99 }),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
  describe('setPurchased', () => {
    beforeEach(() => {
      jest.spyOn(cartsService, 'findOne').mockResolvedValue(cartDtoMock);
      jest.spyOn(cartsService, 'setPurchased').mockResolvedValue({
        ...cartDtoMock,
        purchased: true,
        purchasedDate: new Date(),
      });
    });

    it('should return cart as purchased (sent as owner of cart)', async () => {
      const cart = await controller.setPurchased(1, userDtoMock);
      expect(cart).toEqual({
        ...cartDtoMock,
        purchased: true,
        purchasedDate: expect.any(Date),
      });
    });

    it('should call cartsService.findOne with correct params', async () => {
      await controller.setPurchased(1, userDtoMock);
      expect(cartsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should call cartsService.setPurchased with correct params', async () => {
      await controller.setPurchased(1, userDtoMock);
      expect(cartsService.setPurchased).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not owner of cart', async () => {
      await expect(
        controller.setPurchased(1, { ...userDtoMock, id: 99 }),
      ).rejects.toThrowError(ForbiddenException);
    });
    it('should throw BadRequestException if cart is already purchased', async () => {
      cartsService.findOne = jest.fn().mockResolvedValueOnce({
        ...cartDtoMock,
        purchased: true,
        purchasedDate: new Date(),
      });

      await expect(
        controller.setPurchased(1, userDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      jest.spyOn(cartsService, 'findOne').mockResolvedValue(cartDtoMock);
      jest.spyOn(cartsService, 'delete').mockResolvedValue(true);
    });
    it('should find and delete cart, then return true (sent as owner of cart)', async () => {
      const result = await controller.delete(1, userDtoMock);
      expect(result).toBeTruthy();
    });
    it('should find and delete cart, then return true (sent Admin)', async () => {
      const result = await controller.delete(1, {
        ...userDtoMock,
        role: UserRole.Admin,
      });
      expect(result).toBeTruthy();
    });
    it('should call cartsService.findOne with correct params', async () => {
      await controller.delete(1, userDtoMock);
      expect(cartsService.findOne).toHaveBeenCalledWith(1);
    });
    it('should call cartsService.delete with correct params', async () => {
      await controller.delete(1, userDtoMock);
      expect(cartsService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not owner of cart', async () => {
      await expect(
        controller.delete(1, { ...userDtoMock, id: 99 }),
      ).rejects.toThrowError(ForbiddenException);
    });
    it('should throw BadRequestException if cart is purchased', async () => {
      cartsService.findOne = jest
        .fn()
        .mockResolvedValueOnce({ ...cartDtoMock, purchased: true });
      await expect(controller.delete(1, userDtoMock)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
  describe('createItem', () => {
    beforeEach(() => {
      jest
        .spyOn(cartsService, 'findUnpurchasedByUserId')
        .mockResolvedValue(cartDtoMock);
      jest
        .spyOn(restaurantItemsService, 'findOne')
        .mockResolvedValue(restaurantItemDtoMock);

      jest.spyOn(cartItemsService, 'create').mockResolvedValue(cartItemDtoMock);
    });
    it('should call cartsService.findUnpurchasedByUserId with correct params', async () => {
      await controller.createItem({ restaurantItemId: 1 }, userDtoMock);

      expect(cartsService.findUnpurchasedByUserId).toHaveBeenCalledWith(
        userDtoMock.id,
      );
    });
    it('should call restaurantItemsService.findOne with correct params', async () => {
      await controller.createItem({ restaurantItemId: 1 }, userDtoMock);

      expect(restaurantItemsService.findOne).toHaveBeenCalledWith(
        restaurantItemDtoMock.id,
      );
    });
    it('should call cartItemsService.create with correct params', async () => {
      await controller.createItem({ restaurantItemId: 1 }, userDtoMock);

      expect(cartItemsService.create).toHaveBeenCalledWith(
        cartDtoMock.id,
        restaurantItemDtoMock.id,
      );
    });
    describe('cart exists', () => {
      beforeEach(() => {
        jest
          .spyOn(cartsService, 'findUnpurchasedByUserId')
          .mockResolvedValue(cartDtoMock);
      });
      it('should create cart item', async () => {
        const item = await controller.createItem(
          { restaurantItemId: 1 },
          userDtoMock,
        );

        expect(item).toEqual(cartItemDtoMock);
      });
      it("should throw BadRequestException if restaurant of item doesn't belong to restaurant of cart", async () => {
        cartsService.findUnpurchasedByUserId = jest.fn().mockResolvedValueOnce({
          ...cartDtoMock,
          restaurant: { ...cartDtoMock.restaurant, id: 99 },
        });

        await expect(
          controller.createItem({ restaurantItemId: 1 }, userDtoMock),
        ).rejects.toThrowError(BadRequestException);
      });
      it('should not call cartsService.create', async () => {
        jest.spyOn(cartsService, 'create');
        await controller.createItem({ restaurantItemId: 1 }, userDtoMock);

        expect(cartsService.create).not.toHaveBeenCalled();
      });
    });
    describe("cart doesn't exists", () => {
      beforeEach(() => {
        jest.spyOn(cartsService, 'create').mockResolvedValue(cartDtoMock);
        jest
          .spyOn(cartsService, 'findUnpurchasedByUserId')
          .mockResolvedValue(null);
      });

      it('should create cart item', async () => {
        const item = await controller.createItem(
          { restaurantItemId: 1 },
          userDtoMock,
        );

        expect(item).toEqual(cartItemDtoMock);
      });
      it('should call cartsService.create with correct params', async () => {
        await controller.createItem({ restaurantItemId: 1 }, userDtoMock);

        expect(cartsService.create).toHaveBeenCalledWith(
          userDtoMock.id,
          restaurantItemDtoMock.restaurant.id,
        );
      });
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest
        .spyOn(cartsService, 'findUnpurchasedByUserId')
        .mockResolvedValue({ ...cartDtoMock, cartItems: [cartItemDtoMock] });

      jest
        .spyOn(cartItemsService, 'update')
        .mockResolvedValue({ ...cartItemDtoMock, count: 99 });
    });
    it('should return updated cartItem', async () => {
      const result = await controller.updateItem(1, { count: 99 }, userDtoMock);

      expect(result).toEqual({
        ...cartItemDtoMock,
        count: 99,
      });
    });
    it('should call cartsService.findUnpurchasedByUserId with correct params', async () => {
      await controller.updateItem(1, { count: 99 }, userDtoMock);

      expect(cartsService.findUnpurchasedByUserId).toHaveBeenCalledWith(
        userDtoMock.id,
      );
    });
    it('should call cartItemsService.update with correct params', async () => {
      await controller.updateItem(1, { count: 99 }, userDtoMock);

      expect(cartItemsService.update).toHaveBeenCalledWith(1, { count: 99 });
    });
    it("should throw BadRequestException if unpurchased cart doesn't exists", async () => {
      cartsService.findUnpurchasedByUserId = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(
        controller.updateItem(1, { count: 99 }, userDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });
    it("should throw BadRequestException if item doesn't exists in the cart", async () => {
      cartsService.findUnpurchasedByUserId = jest
        .fn()
        .mockResolvedValueOnce({ ...userDtoMock, cartItems: [] });

      await expect(
        controller.updateItem(1, { count: 99 }, userDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });
    it('should throw BadRequestException if update count value less or equals than 0', async () => {
      await expect(
        controller.updateItem(1, { count: -2 }, userDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });
  });
  describe('deleteItem', () => {
    beforeEach(() => {
      jest
        .spyOn(cartsService, 'findUnpurchasedByUserId')
        .mockResolvedValue({ ...cartDtoMock, cartItems: [cartItemDtoMock] });
      jest.spyOn(cartItemsService, 'delete').mockResolvedValue(true);
      jest.spyOn(cartsService, 'delete').mockResolvedValue(true);

      jest.spyOn(cartsService, 'findOne').mockResolvedValue({
        ...cartDtoMock,
        cartItems: [],
      });
    });

    it('should call cartsService.findUnpurchasedByUserId with correct params', async () => {
      await controller.deleteItem(1, userDtoMock);
      expect(cartsService.findUnpurchasedByUserId).toHaveBeenCalledWith(
        userDtoMock.id,
      );
    });

    it('should call cartItemsService.delete with correct params', async () => {
      await controller.deleteItem(1, userDtoMock);
      expect(cartItemsService.delete).toHaveBeenCalledWith(cartItemDtoMock.id);
    });

    it('should call cartsService.findOne with correct params', async () => {
      await controller.deleteItem(1, userDtoMock);
      expect(cartsService.findOne).toHaveBeenCalledWith(cartDtoMock.id);
    });

    describe('cartItems is not empty', () => {
      beforeEach(() => {
        jest.spyOn(cartsService, 'findOne').mockResolvedValue({
          ...cartDtoMock,
          cartItems: [cartItem2DtoMock],
        });
      });
      it('should delete cartItem and return true', async () => {
        const result = await controller.deleteItem(1, userDtoMock);

        expect(result).toBeTruthy();
      });
      it('should not call cartsService.delete', async () => {
        await controller.deleteItem(1, userDtoMock);
        expect(cartsService.delete).not.toHaveBeenCalled();
      });
    });
    describe('cartItems is empty', () => {
      it('should delete cartItem and return true', async () => {
        const result = await controller.deleteItem(1, userDtoMock);

        expect(result).toBeTruthy();
      });
      it('should call cartsService.delete with correct params', async () => {
        await controller.deleteItem(1, userDtoMock);
        expect(cartsService.delete).toHaveBeenCalledWith(cartDtoMock.id);
      });
    });

    it("should throw BadRequestException if cart doesn't exists", async () => {
      cartsService.findUnpurchasedByUserId = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(controller.deleteItem(1, userDtoMock)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('should throw BadRequestException if cart is empty', async () => {
      cartsService.findUnpurchasedByUserId = jest
        .fn()
        .mockResolvedValueOnce({ ...cartDtoMock, cartItems: [] });

      await expect(controller.deleteItem(1, userDtoMock)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
