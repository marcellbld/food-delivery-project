import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '../../../orders/entities/order.model';
import { OrderDto } from '../../../orders/dto/order.dto';
import { CreateOrderDto } from '../../../orders/dto/create-order.dto';
import { CartsService } from '../../../cart/services/cart/carts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    private readonly cartsService: CartsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    try {
      const cart = await this.cartsService.findOne(createOrderDto.cart);

      if (cart.order) {
        throw new BadRequestException(
          `Cart already picked up by another courier.`,
        );
      }
      const activeOrder = await this.findOneActiveByCourier(
        createOrderDto.courier,
      );
      if (activeOrder) {
        throw new BadRequestException(`You have an active order already.`);
      }

      const deliveryTime = new Date(new Date().getTime() + 1 * 60000);

      const order = this.orderRepository.create({
        ...createOrderDto,
        deliveryTime,
        commission: 0.1,
      });

      await this.orderRepository.persistAndFlush(order);

      return this.mapper.map(order, Order, OrderDto);
    } catch (e: any) {
      throw new BadRequestException(`Order cannot be created , ${e.message}`);
    }
  }

  async findAllByCourier(courierId: number): Promise<OrderDto[]> {
    return this.mapper.mapArray(
      await this.orderRepository.find(
        { courier: courierId },
        {
          populate: [
            'cart',
            'cart.cartItems',
            'cart.cartItems.item',
            'cart.restaurant',
            'cart.user',
          ],
        },
      ),
      Order,
      OrderDto,
    );
  }
  async findOneActiveByCourier(courierId: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne(
      {
        courier: courierId,
        deliveryTime: { $gt: new Date() },
      },
      {
        populate: [
          'cart',
          'cart.cartItems',
          'cart.cartItems.item',
          'cart.restaurant',
          'cart.user',
        ],
      },
    );
    return this.mapper.map(order, Order, OrderDto);
  }
}
