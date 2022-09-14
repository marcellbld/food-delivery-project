import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartItem } from '../../dto/update-cart-item.dto';
import { CartItemDto } from '../../dto/cart-item.dto';
import { CartItem } from '../../entities/cart-item.model';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: EntityRepository<CartItem>,
  ) {}

  async findOne(id: number): Promise<CartItemDto> {
    const cartItem = await this.cartItemRepository.findOne({ id });

    if (!cartItem)
      throw new NotFoundException(`Cart Item doesn't exists with id (#${id})`);

    return this.mapper.map(cartItem, CartItem, CartItemDto);
  }
  async findOneByCartIdAndRestaurantItemId(
    cartId: number,
    restaurantItemId: number,
  ): Promise<CartItemDto> {
    const cartItem = await this.cartItemRepository.findOne({
      cart: cartId,
      item: restaurantItemId,
    });

    if (!cartItem) throw new NotFoundException(`Cart Item doesn't exists`);

    return this.mapper.map(cartItem, CartItem, CartItemDto);
  }

  async findAllByCartId(cartId: number): Promise<CartItemDto[]> {
    const cartItems = await this.cartItemRepository.find({ cart: cartId });

    return this.mapper.mapArrayAsync(cartItems, CartItem, CartItemDto);
  }

  async create(cartId: number, restaurantItemid: number): Promise<CartItemDto> {
    let cartItem = await this.cartItemRepository.findOne({
      cart: cartId,
      item: restaurantItemid,
    });
    if (cartItem) {
      cartItem.count++;
    } else {
      cartItem = this.cartItemRepository.create({
        cart: cartId,
        item: restaurantItemid,
      });
    }

    await this.cartItemRepository.persistAndFlush(cartItem);

    return this.mapper.map(cartItem, CartItem, CartItemDto);
  }

  async update(
    id: number,
    updateCartItem: UpdateCartItem,
  ): Promise<CartItemDto> {
    const cartItem = await this.cartItemRepository.findOne({
      id,
    });
    if (!cartItem) throw new NotFoundException("Cart item doesn't exists");

    cartItem.count = updateCartItem.count;

    await this.cartItemRepository.persistAndFlush(cartItem);

    return this.mapper.map(cartItem, CartItem, CartItemDto);
  }

  async delete(id: number): Promise<boolean> {
    const cartItem = await this.cartItemRepository.findOne({ id });
    if (!cartItem) throw new NotFoundException("Cart Item doesn't exists");

    await this.cartItemRepository.removeAndFlush(cartItem);

    return true;
  }
}
