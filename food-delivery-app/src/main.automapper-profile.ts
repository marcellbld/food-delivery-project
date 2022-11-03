import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWith,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CartItem } from './cart/entities/cart-item.model';
import { CartItemDto } from './cart/dto/cart-item.dto';
import { RestaurantItemDto } from './restaurants/dto/restaurant-item/restaurant-item.dto';
import { RestaurantDto } from './restaurants/dto/restaurant/restaurant.dto';
import { RestaurantItem } from './restaurants/entities/restaurant-item.model';
import { Restaurant } from './restaurants/entities/restaurant.model';
import { CartDto } from './cart/dto/cart.dto';
import { Cart } from './cart/entities/cart.model';
import { User } from './users/entities/user.model';
import { UserDto } from './users/dto/user.dto';
import { Category } from './categories/entities/category.model';
import { CategoryDto } from './categories/dto/category.dto';
import { Order } from './orders/entities/order.model';
import { OrderDto } from './orders/dto/order.dto';

@Injectable()
export class MainAutomapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Cart,
        CartDto,
        forMember(
          (dest) => dest.cartItems,
          mapWith(CartItemDto, CartItem, (source) =>
            source.cartItems ? source.cartItems.toArray() : [],
          ),
        ),
      );
      createMap(
        mapper,
        CartItem,
        CartItemDto,
        forMember(
          (dest) => dest.item,
          mapWith(RestaurantItemDto, RestaurantItem, (source) => {
            return source.item;
          }),
        ),
        forMember(
          (dest) => dest.price,
          mapFrom((source) =>
            parseFloat((source.item.price * source.count).toFixed(2)),
          ),
        ),
      );
      createMap(mapper, Category, CategoryDto);
      createMap(
        mapper,
        Restaurant,
        RestaurantDto,
        forMember(
          (dest) => dest.categories,
          mapWith(CategoryDto, Category, (source) =>
            source.categories ? source.categories.toArray() : [],
          ),
        ),
        forMember(
          (destination) => destination.location,
          mapFrom((source) => [source.locationLon, source.locationLat]),
        ),
      );
      createMap(mapper, RestaurantItem, RestaurantItemDto);
      createMap(
        mapper,
        Order,
        OrderDto,
        forMember(
          (destination) => destination.cart,
          mapFrom((source) =>
            this.mapper.map({ ...source.cart, order: null }, Cart, CartDto),
          ),
        ),
      );
      createMap(
        mapper,
        User,
        UserDto,
        forMember(
          (destination) => destination.address,
          mapFrom((source) => [source.addressLon, source.addressLat]),
        ),
      );
    };
  }
}
