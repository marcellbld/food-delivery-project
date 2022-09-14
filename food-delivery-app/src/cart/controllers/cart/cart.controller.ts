import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/roles.decorator';
import { CartDto } from '../../dto/cart.dto';
import { CartsService } from '../../services/cart/carts.service';
import { UserRole } from '../../../users/user-role';
import { UserParam } from '../../../auth/user-param.decorator';
import { UserDto } from '../../../users/dto/user.dto';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { RestaurantItemsService } from '../../../restaurants/services/restaurant-items/restaurant-items.service';
import { CreateCartItemDto } from '../../dto/create-cart-item.dto';
import { CartItemsService } from '../../services/cart-item/cart-items.service';
import { UpdateCartItem } from '../../dto/update-cart-item.dto';
import { CartItemDto } from '../../dto/cart-item.dto';

@Controller('carts')
export class CartController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly cartItemsService: CartItemsService,
    private readonly restaurantItemsService: RestaurantItemsService,
  ) {}

  @Get('unpurchased')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async findUnpurchasedByUser(@UserParam() user: UserDto): Promise<CartDto> {
    const cart = await this.cartsService.findUnpurchasedByUserId(user.id);
    return cart;
  }

  @Get('purchased')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async findAllPurchasedByUser(@UserParam() user: UserDto): Promise<CartDto[]> {
    const carts = await this.cartsService.findAllPurchasedByUserId(user.id);
    return carts;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  async findOne(
    @Param('id') id: number,
    @UserParam() user: UserDto,
  ): Promise<CartDto> {
    const cart = await this.cartsService.findOne(id);
    if (user.role === UserRole.User && user.id !== cart.user.id)
      throw new ForbiddenException();

    return cart;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async setPurchased(
    @Param('id') id: number,
    @UserParam() user: UserDto,
  ): Promise<CartDto> {
    const cart = await this.cartsService.findOne(id);
    if (cart.user.id !== user.id) throw new ForbiddenException();
    if (cart.purchased) throw new BadRequestException();

    return this.cartsService.setPurchased(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  async delete(
    @Param('id') id: number,
    @UserParam() user: UserDto,
  ): Promise<boolean> {
    const cart = await this.cartsService.findOne(id);
    if (user.role === UserRole.User && cart.user.id !== user.id)
      throw new ForbiddenException();
    if (cart.purchased) throw new BadRequestException();

    return await this.cartsService.delete(id);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async createItem(
    @Body() createCartItem: CreateCartItemDto,
    @UserParam() user: UserDto,
  ): Promise<CartItemDto> {
    let unpurchasedCart = await this.cartsService.findUnpurchasedByUserId(
      user.id,
    );
    const item = await this.restaurantItemsService.findOne(
      createCartItem.restaurantItemId,
    );
    if (!unpurchasedCart) {
      unpurchasedCart = await this.cartsService.create(
        user.id,
        item.restaurant.id,
      );
    } else if (unpurchasedCart.restaurant.id !== item.restaurant.id) {
      throw new BadRequestException(
        'You already have a cart at other restaurant. Please delete it first!',
      );
    }

    const cartItem = await this.cartItemsService.create(
      unpurchasedCart.id,
      item.id,
    );

    return cartItem;
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItem: UpdateCartItem,
    @UserParam() user: UserDto,
  ): Promise<CartItemDto> {
    const selfCart = await this.cartsService.findUnpurchasedByUserId(user.id);
    if (!selfCart) throw new BadRequestException("You can't update this item.");
    const foundItem = selfCart.cartItems.find((item) => item.id === id);

    if (!foundItem)
      throw new BadRequestException("You can't update this item.");

    if (updateCartItem.count <= 0) {
      throw new BadRequestException(
        "You can't update this item when the count below or equals to 0. Delete instead.",
      );
    }

    return await this.cartItemsService.update(id, updateCartItem);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async deleteItem(
    @Param('id', ParseIntPipe) id: number,
    @UserParam() user: UserDto,
  ): Promise<boolean> {
    const selfCart = await this.cartsService.findUnpurchasedByUserId(user.id);
    if (!selfCart) throw new BadRequestException("You can't delete this item.");

    const foundItem = selfCart.cartItems.find((item) => item.id === id);

    if (!foundItem)
      throw new BadRequestException("You can't delete this item.");

    const result = await this.cartItemsService.delete(foundItem.id);

    if (result) {
      const cart = await this.cartsService.findOne(selfCart.id);
      if (cart.cartItems.length == 0) {
        await this.cartsService.delete(cart.id);
      }
    }

    return result;
  }
}
