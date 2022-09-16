import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRestaurantItemDto } from '../../dto/restaurant-item/update-restaurant-item.dto';
import { CreateRestaurantItemDto } from '../../dto/restaurant-item/create-restaurant-item.dto';
import { RestaurantItemDto } from '../../dto/restaurant-item/restaurant-item.dto';
import { RestaurantItem } from '../../entities/restaurant-item.model';

@Injectable()
export class RestaurantItemsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(RestaurantItem)
    private readonly restaurantItemRepository: EntityRepository<RestaurantItem>,
  ) {}

  async findOne(id: number): Promise<RestaurantItemDto> {
    const item = await this.restaurantItemRepository.findOne({ id });

    if (!item) throw new NotFoundException("Restaurant Item doesn't exists");

    return this.mapper.mapAsync(item, RestaurantItem, RestaurantItemDto);
  }

  async findAllByRestaurant(
    restaurantId: number,
  ): Promise<RestaurantItemDto[]> {
    const restaurantItems = await this.restaurantItemRepository.find({
      restaurant: { id: restaurantId },
    });

    return this.mapper.mapArrayAsync(
      restaurantItems,
      RestaurantItem,
      RestaurantItemDto,
    );
  }

  async findPopularItems(restaurantId: number): Promise<RestaurantItemDto[]> {
    const restaurantItems = await this.restaurantItemRepository.find(
      {
        restaurant: { id: restaurantId },
      },
      { limit: 5 },
    );

    return this.mapper.mapArrayAsync(
      restaurantItems,
      RestaurantItem,
      RestaurantItemDto,
    );
  }

  async create(
    restaurantId: number,
    createRestaurantItemDto: CreateRestaurantItemDto,
  ): Promise<RestaurantItemDto> {
    const item = this.restaurantItemRepository.create({
      ...createRestaurantItemDto,
      price: parseFloat(createRestaurantItemDto.price),
      restaurant: restaurantId,
    });

    await this.restaurantItemRepository.persistAndFlush(item);

    return this.mapper.map(
      await this.restaurantItemRepository.findOne(item.id, {
        populate: ['restaurant'],
      }),
      RestaurantItem,
      RestaurantItemDto,
    );
  }

  async update(
    updateRestaurantItemDto: UpdateRestaurantItemDto,
    imageFileName: string,
  ): Promise<RestaurantItemDto> {
    const restaurantItem = await this.restaurantItemRepository.findOne({
      id: +updateRestaurantItemDto.id,
    });
    if (!restaurantItem)
      throw new BadRequestException("Restaurant Item doesn't exists");

    restaurantItem.name = updateRestaurantItemDto.name ?? restaurantItem.name;

    restaurantItem.description =
      updateRestaurantItemDto.description ?? restaurantItem.description;

    restaurantItem.price = updateRestaurantItemDto.price
      ? parseFloat(updateRestaurantItemDto.price)
      : restaurantItem.price;

    restaurantItem.image = imageFileName ?? restaurantItem.image;

    await this.restaurantItemRepository.persistAndFlush(restaurantItem);

    return this.mapper.map(
      await this.restaurantItemRepository.findOne(restaurantItem.id, {
        populate: ['restaurant'],
      }),
      RestaurantItem,
      RestaurantItemDto,
    );
  }

  async delete(id: number): Promise<boolean> {
    const item = await this.restaurantItemRepository.findOne({ id });

    if (!item) throw new BadRequestException("Restaurant Item doesn't exists");

    await this.restaurantItemRepository.removeAndFlush(item);

    return true;
  }
}
