import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserParam } from '../../../auth/user-param.decorator';
import { CreateOrderDto } from '../../../orders/dto/create-order.dto';
import { UserDto } from '../../../users/dto/user.dto';
import { OrderDto } from '../../../orders/dto/order.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { UserRole } from '../../../users/user-role';
import { OrdersService } from '../../../orders/services/orders/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Courier)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UserParam() userDto: UserDto,
  ): Promise<OrderDto> {
    if (userDto.role === UserRole.Admin) {
      return await this.ordersService.create(createOrderDto);
    } else {
      return await this.ordersService.create({
        ...createOrderDto,
        courier: userDto.id,
      });
    }
  }

  @Get('self')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Courier)
  async findSelfOrders(@UserParam() userDto: UserDto): Promise<OrderDto[]> {
    return await this.ordersService.findAllByCourier(userDto.id);
  }

  @Get('self-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Courier)
  async findSelfActiveOrder(@UserParam() userDto: UserDto): Promise<OrderDto> {
    return await this.ordersService.findOneActiveByCourier(userDto.id);
  }
}
