import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { QueryOrder } from '@mikro-orm/core';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartDto } from '../../dto/cart.dto';
import { Cart } from '../../entities/cart.model';

@Injectable()
export class CartsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Cart)
    private readonly cartRepository: EntityRepository<Cart>,
  ) {}

  async create(userId: number, restaurantId: number): Promise<CartDto> {
    if (await this.findActiveCartByUserId(userId))
      throw new BadRequestException('User already has active cart');

    const cart = this.cartRepository.create({
      user: userId,
      restaurant: restaurantId,
    });

    await this.cartRepository.persistAndFlush(cart);

    return this.mapper.map(cart, Cart, CartDto);
  }

  async findOne(id: number): Promise<CartDto> {
    const cart = await this.cartRepository.findOne(
      { id },
      { populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'] },
    );

    if (!cart) throw new NotFoundException("Cart doesn't exists");

    return this.mapper.map(cart, Cart, CartDto);
  }

  async findActiveCartByUserId(userId: number): Promise<CartDto> {
    let cart = await this.findUnpurchasedByUserId(userId);
    if (!cart) {
      cart = await this.findUndeliveredByUserId(userId);
    }
    if (!cart) {
      cart = await this.findDeliveryOnTheWayByUserId(userId);
    }

    return this.mapper.map(cart, Cart, CartDto);
  }

  private async findUnpurchasedByUserId(userId: number): Promise<Cart> {
    return await this.cartRepository.findOne(
      {
        user: userId,
        purchased: false,
      },
      { populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'] },
    );
  }
  private async findUndeliveredByUserId(userId: number): Promise<Cart> {
    return await this.cartRepository.findOne(
      {
        user: userId,
        purchased: true,
      },
      {
        populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'],
        filters: { undelivered: true },
      },
    );
  }
  private async findDeliveryOnTheWayByUserId(userId: number): Promise<Cart> {
    const carts = await this.cartRepository.find(
      {
        user: userId,
        purchased: true,
      },
      {
        populate: [
          'cartItems',
          'cartItems.item',
          'user',
          'restaurant',
          'order',
        ],
      },
    );

    const cart = carts.find((c) => c.order.deliveryTime > new Date());

    return cart;
  }

  async findAllDeliveredByUserId(userId: number): Promise<CartDto[]> {
    let carts = await this.cartRepository.find(
      {
        user: userId,
        purchased: true,
        order: { $ne: null },
      },
      {
        populate: [
          'cartItems',
          'cartItems.item',
          'user',
          'restaurant',
          'order',
        ],
        orderBy: { purchasedDate: QueryOrder.DESC_NULLS_LAST },
      },
    );

    carts = carts.filter((cart) => cart.order.deliveryTime <= new Date());

    return this.mapper.mapArray(carts, Cart, CartDto);
  }

  async findAllUndelivered(): Promise<CartDto[]> {
    const carts = await this.cartRepository.find(
      {
        purchased: true,
        order: { $eq: null },
      },
      {
        populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'],
        orderBy: { purchasedDate: QueryOrder.DESC_NULLS_LAST },
      },
    );

    return this.mapper.mapArray(carts, Cart, CartDto);
  }

  async setPurchased(id: number): Promise<CartDto> {
    const cart = await this.cartRepository.findOne(
      { id },
      { populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'] },
    );

    if (!cart) throw new NotFoundException("Cart doesn't exists");

    cart.purchased = true;
    cart.purchasedDate = new Date();

    await this.cartRepository.persistAndFlush(cart);

    return this.mapper.map(cart, Cart, CartDto);
  }

  async delete(id: number): Promise<boolean> {
    const cart = await this.cartRepository.findOne(
      { id },
      {
        populate: ['cartItems', 'cartItems.item', 'user', 'restaurant'],
      },
    );

    if (!cart) throw new NotFoundException("Cart doesn't exists");

    if (cart.order !== null)
      throw new BadRequestException("Can't delete this cart");

    await this.cartRepository.removeAndFlush(cart);

    return true;
  }
}
