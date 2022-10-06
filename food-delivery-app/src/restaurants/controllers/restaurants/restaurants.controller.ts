import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UserParam } from '../../../auth/user-param.decorator';
import { UserDto } from '../../../users/dto/user.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateRestaurantDto } from '../../dto/restaurant/create-restaurant.dto';
import { RestaurantDto } from '../../dto/restaurant/restaurant.dto';
import { RestaurantsService } from '../../services/restaurants/restaurants.service';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { UserRole } from '../../../users/user-role';
import { UpdateRestaurantDto } from '../../dto/restaurant/update-restaurant.dto';
import { RestaurantItemDto } from '../../dto/restaurant-item/restaurant-item.dto';
import { RestaurantItemsService } from '../../services/restaurant-items/restaurant-items.service';
import { CreateRestaurantItemDto } from '../../dto/restaurant-item/create-restaurant-item.dto';
import { UpdateRestaurantItemDto } from '../../dto/restaurant-item/update-restaurant-item.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private restaurantsService: RestaurantsService,
    private restaurantItemsService: RestaurantItemsService,
  ) {}

  @Get()
  async findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('nameFilter', new DefaultValuePipe(''))
    nameFilter: string,
  ): Promise<RestaurantDto[]> {
    return await this.restaurantsService.findAll(skip, nameFilter);
  }

  @Get('self')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner)
  async findSelfRestaurants(
    @UserParam() userDto: UserDto,
  ): Promise<RestaurantDto[]> {
    return await this.restaurantsService.findByOwner(userDto.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RestaurantDto> {
    return await this.restaurantsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './dist/public/uploads/restaurants',
    }),
  )
  async create(
    @Body({
      transform: (val) => {
        return { ...val, categories: JSON.parse(val.categories) };
      },
    })
    createRestaurantDto: CreateRestaurantDto,
    @UserParam() userDto: UserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpg|jpeg|png' })
        .addMaxSizeValidator({ maxSize: 2500000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ): Promise<RestaurantDto> {
    const filename = file?.filename ?? null;

    if (userDto.role === UserRole.Admin)
      return await this.restaurantsService.create({
        ...createRestaurantDto,
        image: filename,
      });
    else
      return await this.restaurantsService.create({
        ...createRestaurantDto,
        owner: userDto.id,
        image: filename,
      });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './dist/public/uploads/restaurants',
    }),
  )
  async update(
    @Param('id') id: number,
    @Body({
      transform: (val) => {
        return { ...val, categories: JSON.parse(val.categories) };
      },
    })
    updateRestaurantDto: UpdateRestaurantDto,
    @UserParam() userDto: UserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpg|jpeg|png' })
        .addMaxSizeValidator({ maxSize: 2500000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ): Promise<RestaurantDto> {
    const filename = file?.filename ?? null;
    if (
      userDto.role === UserRole.Admin ||
      (await this.restaurantsService.compareOwner(userDto.id, id))
    ) {
      return await this.restaurantsService.update(
        id,
        updateRestaurantDto,
        filename,
      );
    } else throw new ForbiddenException('Cannot update this restaurant');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  async delete(
    @Param('id') id: number,
    @UserParam() userDto: UserDto,
  ): Promise<boolean> {
    if (
      userDto.role === UserRole.Admin ||
      (await this.restaurantsService.compareOwner(userDto.id, id))
    ) {
      return this.restaurantsService.delete(id);
    } else throw new ForbiddenException('Cannot delete this restaurant');
  }

  @Get(':id/items')
  async findAllItemsByRestaurant(
    @Param('id') id: number,
  ): Promise<RestaurantItemDto[]> {
    return this.restaurantItemsService.findAllByRestaurant(id);
  }

  @Get(':id/items/popular')
  async findPopularItemsByRestaurant(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RestaurantItemDto[]> {
    return this.restaurantItemsService.findPopularItems(id);
  }

  @Post(':id/items')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './dist/public/uploads/restaurant-items',
    }),
  )
  async createItem(
    @Param('id') restaurantId: number,
    @Body() createRestaurantItem: CreateRestaurantItemDto,
    @UserParam() userDto: UserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpg|jpeg|png' })
        .addMaxSizeValidator({ maxSize: 2500000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ): Promise<RestaurantItemDto> {
    const filename = file?.filename ?? null;

    if (
      userDto.role === UserRole.Admin ||
      (await this.restaurantsService.compareOwner(userDto.id, restaurantId))
    ) {
      return this.restaurantItemsService.create(restaurantId, {
        ...createRestaurantItem,
        image: filename,
      });
    } else throw new ForbiddenException('Cannot create item.');
  }

  @Delete(':id/items/:itemid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @UsePipes(ValidationPipe)
  async deleteItem(
    @Param('id') id: number,
    @UserParam() userDto: UserDto,
    @Param('itemid') itemId: number,
  ): Promise<boolean> {
    if (
      userDto.role === UserRole.Admin ||
      (await this.restaurantsService.compareOwner(userDto.id, id))
    ) {
      return this.restaurantItemsService.delete(itemId);
    } else throw new ForbiddenException('Cannot delete this item');
  }

  @Patch(':id/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './dist/public/uploads/restaurant-items',
    }),
  )
  async updateItem(
    @Param('id') id: number,
    @Body() updateRestaurantItemDto: UpdateRestaurantItemDto,
    @UserParam() userDto: UserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpg|jpeg|png' })
        .addMaxSizeValidator({ maxSize: 2500000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ): Promise<RestaurantItemDto> {
    const filename = file?.filename ?? null;

    if (
      userDto.role === UserRole.Admin ||
      (await this.restaurantsService.compareOwner(userDto.id, id))
    ) {
      return this.restaurantItemsService.update(
        updateRestaurantItemDto,
        filename,
      );
    } else throw new ForbiddenException('Cannot update this item');
  }

  @Get('is-name-taken/:name')
  async isRestaurantNameTaken(@Param('name') name: string): Promise<boolean> {
    try {
      await this.restaurantsService.findOneByName(name);
    } catch (e: any) {
      if (e.status === 404) {
        return false;
      }
    }
    return true;
  }
}
