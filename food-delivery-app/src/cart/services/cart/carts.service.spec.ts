import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Cart } from '../../entities/cart.model';
import { CartsService } from './carts.service';
import * as CartMocks from '../../../../test/mocks/cart.mock';
import { MainAutomapperProfile } from '../../../main.automapper-profile';

describe('CartService', () => {
  let service: CartsService;
  let cartRepository: EntityRepository<Cart>;

  const CART_REPOSITORY_TOKEN = getRepositoryToken(Cart);

  let cartMock;
  let cartDtoMock;
  let cartPurchasedArrayMock;
  let cartPurchasedArrayDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        MainAutomapperProfile,
        CartsService,
        {
          provide: CART_REPOSITORY_TOKEN,
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

    service = module.get<CartsService>(CartsService);
    cartRepository = module.get<EntityRepository<Cart>>(CART_REPOSITORY_TOKEN);
  });

  beforeEach(() => {
    cartMock = CartMocks.cartMock();
    cartDtoMock = CartMocks.cartDtoMock();
    cartPurchasedArrayMock = [
      CartMocks.purchasedCartMock(),
      CartMocks.purchasedCart2Mock(),
    ];
    cartPurchasedArrayDtoMock = [
      CartMocks.purchasedCartDtoMock(),
      CartMocks.purchasedCart2DtoMock(),
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('CartRepository should be defined', () => {
    expect(cartRepository).toBeDefined();
  });
  describe('create', () => {
    const setup = (hasUnpurchasedCart: boolean) => {
      jest.spyOn(cartRepository, 'create').mockReturnValue(cartMock);
      jest
        .spyOn(CartsService.prototype as any, 'findActiveCartByUserId')
        .mockImplementationOnce(() => (hasUnpurchasedCart ? {} : null));
    };
    const userId = 1;
    const restaurantId = 1;

    it('should create cart and return as CartDto', async () => {
      setup(false);

      const cart = await service.create(userId, restaurantId);

      expect(cart).toEqual(cartDtoMock);
    });
    it('should call findActiveCartByUserId method with correct params', async () => {
      setup(false);

      await service.create(userId, restaurantId);

      expect(
        (CartsService.prototype as any).findActiveCartByUserId,
      ).toBeCalledWith(userId);
    });
    it('should call cartRepository.create with correct params', async () => {
      setup(false);

      await service.create(userId, restaurantId);

      expect(cartRepository.create).toBeCalledWith({
        user: userId,
        restaurant: restaurantId,
      });
    });
    it('should call cartRepository.persistAndFlush with correct params', async () => {
      setup(false);

      await service.create(userId, restaurantId);

      expect(cartRepository.persistAndFlush).toBeCalledWith(cartMock);
    });
    it('should throw BadRequestException when user already has unpurchased cart', async () => {
      setup(true);

      await expect(service.create(userId, restaurantId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartMock);
    });

    it('should return cart as CartDto', async () => {
      const cart = await service.findOne(cartMock.id);

      expect(cart).toEqual(cartDtoMock);
    });
    it('should call cartRepository.findOne with correct params', async () => {
      await service.findOne(cartMock.id);
      expect(cartRepository.findOne).toHaveBeenCalledWith(
        { id: cartMock.id },
        { populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'] },
      );
    });
    it("should throw NotFoundException if cart doesn't exists", async () => {
      cartRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(cartMock.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('setPurchased', () => {
    beforeEach(() => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartMock);
    });
    it('should find cart then set purchased to true and return as CartDto', async () => {
      const cart = await service.setPurchased(cartMock.id);

      expect(cart).toEqual({
        ...cartDtoMock,
        purchased: true,
        purchasedDate: expect.any(Date),
      });
    });
    it('should call cartRepository.findOne with correct params', async () => {
      await service.setPurchased(cartMock.id);

      expect(cartRepository.findOne).toHaveBeenCalledWith(
        { id: cartMock.id },
        { populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'] },
      );
    });
    it('should call cartRepository.persistAndFlush with correct params', async () => {
      await service.setPurchased(cartMock.id);

      expect(cartRepository.persistAndFlush).toHaveBeenCalledWith({
        ...cartMock,
        purchased: true,
        purchasedDate: expect.any(Date),
      });
    });
    it("should throw NotFoundException if cart doesn't exists", async () => {
      cartRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.setPurchased(cartMock.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cartMock);
    });

    it('should find cart then remove and return true', async () => {
      const result = await service.delete(cartMock.id);

      expect(result).toBeTruthy();
    });

    it('should call cartRepository.findOne with correct params', async () => {
      await service.delete(cartMock.id);

      expect(cartRepository.findOne).toHaveBeenCalledWith(
        { id: cartMock.id },
        {
          populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'],
        },
      );
    });
    it('should call cartRepository.removeAndFlush with correct params', async () => {
      await service.delete(cartMock.id);

      expect(cartRepository.removeAndFlush).toHaveBeenCalledWith(cartMock);
    });
    it("should throw NotFoundException if cart doesn't exists", async () => {
      cartRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.delete(cartMock.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
