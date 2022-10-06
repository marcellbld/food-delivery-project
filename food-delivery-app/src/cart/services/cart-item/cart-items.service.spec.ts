import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CartItem } from '../../entities/cart-item.model';
import { CartItemsService } from './cart-items.service';
import * as CartItemMocks from '../../../../test/mocks/cart-item.mock';
import { MainAutomapperProfile } from '../../../main.automapper-profile';

describe('CartItemService', () => {
  let service: CartItemsService;
  let cartItemRepository: EntityRepository<CartItem>;

  const CART_ITEM_REPOSITORY_TOKEN = getRepositoryToken(CartItem);

  let cartItemMock;
  let cartItemDtoMock;
  let cartItem2Mock;
  let cartItem2DtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        MainAutomapperProfile,
        CartItemsService,
        {
          provide: CART_ITEM_REPOSITORY_TOKEN,
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

    service = module.get<CartItemsService>(CartItemsService);
    cartItemRepository = module.get<EntityRepository<CartItem>>(
      CART_ITEM_REPOSITORY_TOKEN,
    );
  });

  beforeEach(() => {
    cartItemMock = CartItemMocks.cartItemMock();
    cartItemDtoMock = CartItemMocks.cartItemDtoMock();
    cartItem2Mock = CartItemMocks.cartItem2Mock();
    cartItem2DtoMock = CartItemMocks.cartItem2DtoMock();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('CartItemRepository should be defined', () => {
    expect(cartItemRepository).toBeDefined();
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(cartItemMock);
    });

    it('should return a cartItem as CartItemDto', async () => {
      const cartItem = await service.findOne(cartItemMock.id);

      expect(cartItem).toEqual(cartItemDtoMock);
    });
    it('should call cartItemRepository.findOne with correct params', async () => {
      await service.findOne(cartItemMock.id);

      expect(cartItemRepository.findOne).toHaveBeenCalledWith({
        id: cartItemMock.id,
      });
    });
    it("should throw NotFoundException when cartItem doesn't exists", async () => {
      cartItemRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.findOne(cartItemMock.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('findOneByCartIdAndRestaurantItemId', () => {
    beforeEach(() => {
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(cartItemMock);
    });
    it('should return cartItem as CartItemDto', async () => {
      const cartItem = await service.findOneByCartIdAndRestaurantItemId(
        cartItemMock.id,
        cartItemMock.item.id,
      );
      expect(cartItem).toEqual(cartItemDtoMock);
    });
    it('should call cartItemRepository.findOne with correct params', async () => {
      await service.findOneByCartIdAndRestaurantItemId(
        cartItemMock.id,
        cartItemMock.item.id,
      );

      expect(cartItemRepository.findOne).toHaveBeenCalledWith({
        cart: cartItemMock.id,
        item: cartItemMock.item.id,
      });
    });
    it("should throw NotFoundException when cartItem doesn't exists", async () => {
      cartItemRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.findOneByCartIdAndRestaurantItemId(
          cartItemMock.id,
          cartItemMock.item.id,
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });
  describe('findAllByCartId', () => {
    beforeEach(() => {
      jest
        .spyOn(cartItemRepository, 'find')
        .mockResolvedValueOnce([cartItemMock, cartItem2Mock]);
    });
    it('should return all cart items as CartItemDto', async () => {
      const cartItems = await service.findAllByCartId(cartItemMock.cart.id);

      expect(cartItems).toEqual([cartItemDtoMock, cartItem2DtoMock]);
    });
    it('should call cartItemsRepository.find with correct params', async () => {
      await service.findAllByCartId(cartItemMock.cart.id);

      expect(cartItemRepository.find).toHaveBeenCalledWith({
        cart: cartItemMock.cart.id,
      });
    });
  });
  describe('create', () => {
    beforeEach(() => {
      jest
        .spyOn(cartItemRepository, 'create')
        .mockReturnValueOnce(cartItemMock);
    });
    describe("cartItem still doesn't exists", () => {
      beforeEach(() => {
        cartItemRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      });
      it('should create cart item and return as CartItemDto', async () => {
        const cartItem = await service.create(
          cartItemMock.cart.id,
          cartItemMock.item.id,
        );

        expect(cartItem).toEqual(cartItemDtoMock);
      });

      it('should call cartItemRepository.create with correct params', async () => {
        await service.create(cartItemMock.cart.id, cartItemMock.item.id);

        expect(cartItemRepository.create).toHaveBeenCalledWith({
          cart: cartItemMock.cart.id,
          item: cartItemMock.item.id,
        });
      });
      it('should call cartItemRepository.persistAndFlush with correct params', async () => {
        await service.create(cartItemMock.cart.id, cartItemMock.item.id);

        expect(cartItemRepository.persistAndFlush).toHaveBeenCalledWith(
          cartItemMock,
        );
      });
    });
    describe('cartItem already exists', () => {
      beforeEach(() => {
        cartItemRepository.findOne = jest.fn().mockResolvedValue(cartItemMock);
      });
      it('should return cartItem with increased count', async () => {
        const cartItem = await service.create(
          cartItemMock.cart.id,
          cartItemMock.item.id,
        );

        expect(cartItem).toEqual({
          ...cartItemDtoMock,
          count: CartItemMocks.cartItemMock().count + 1,
          price: 3 * CartItemMocks.cartItemMock().item.price,
        });
      });
      it('should not call cartItemRepository.create when cartItem exists', async () => {
        await service.create(cartItemMock.cart.id, cartItemMock.item.id);

        expect(cartItemRepository.create).not.toBeCalled();
      });
      it('should call cartItemRepository.persistAndFlush with correct params', async () => {
        await service.create(cartItemMock.cart.id, cartItemMock.item.id);

        expect(cartItemRepository.persistAndFlush).toHaveBeenCalledWith({
          ...cartItemMock,
          count: CartItemMocks.cartItemMock().count + 1,
        });
      });
    });
  });
  describe('update', () => {
    describe('cartItem exists', () => {
      beforeEach(() => {
        jest
          .spyOn(cartItemRepository, 'findOne')
          .mockResolvedValue(cartItemMock);
      });
      it('should find cartItem and update count then return as CartItemDto', async () => {
        const updatedCartItem = await service.update(1, { count: 20 });

        expect(updatedCartItem).toEqual({
          ...cartItemDtoMock,
          count: 20,
          price: 20 * CartItemMocks.cartItemMock().item.price,
        });
      });
      it('should call cartItemRepository.persistAndFlush with correct params', async () => {
        await service.update(1, { count: 20 });

        expect(cartItemRepository.persistAndFlush).toHaveBeenCalledWith(
          cartItemMock,
        );
      });
    });
    describe("cartItem doesn't exists", () => {
      beforeEach(() => {
        jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        await expect(service.update(1, { count: 20 })).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });
  describe('delete', () => {
    describe('cartItem exists', () => {
      beforeEach(() => {
        jest
          .spyOn(cartItemRepository, 'findOne')
          .mockResolvedValue(cartItemMock);
      });
      it('should delete cartItem and return true', async () => {
        const result = await service.delete(cartItemMock.id);

        expect(result).toBeTruthy();
      });
      it('should call cartItemRepository.removeAndFlush with correct params', async () => {
        await service.delete(cartItemMock.id);

        expect(cartItemRepository.removeAndFlush).toHaveBeenCalledWith(
          cartItemMock,
        );
      });
    });
    describe("cartItem doesn't exists", () => {
      beforeEach(() => {
        jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(null);
      });
      it('should throw NotFoundException', async () => {
        await expect(service.delete(cartItemMock.id)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });
});
