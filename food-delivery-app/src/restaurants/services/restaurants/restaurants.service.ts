import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '../../../categories/entities/category.model';
import { UpdateRestaurantDto } from 'src/restaurants/dto/restaurant/update-restaurant.dto';
import { CreateRestaurantDto } from '../../dto/restaurant/create-restaurant.dto';
import { RestaurantDto } from '../../dto/restaurant/restaurant.dto';
import { Restaurant } from '../../entities/restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: EntityRepository<Restaurant>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}

  async findAll(skip: number): Promise<RestaurantDto[]> {
    return this.mapper.mapArray(
      await this.restaurantRepository.findAll({
        populate: ['categories'],
        limit: 10,
        offset: skip,
      }),
      Restaurant,
      RestaurantDto,
    );
  }

  async findByOwner(id: number): Promise<RestaurantDto[]> {
    return this.mapper.mapArrayAsync(
      await this.restaurantRepository.find(
        { owner: id },
        {
          populate: ['categories'],
        },
      ),
      Restaurant,
      RestaurantDto,
    );
  }

  async findOne(id: number): Promise<RestaurantDto> {
    const restaurant = await this.restaurantRepository.findOne(id, {
      populate: ['categories'],
    });

    if (!restaurant) {
      throw new NotFoundException();
    }

    return this.mapper.map(restaurant, Restaurant, RestaurantDto);
  }

  async findOneByName(name: string): Promise<RestaurantDto> {
    const restaurant = await this.restaurantRepository.findOne(
      { name },
      {
        populate: ['categories'],
      },
    );

    if (!restaurant) {
      throw new NotFoundException();
    }

    return this.mapper.map(restaurant, Restaurant, RestaurantDto);
  }

  async create(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantDto> {
    try {
      const restaurant = this.restaurantRepository.create(createRestaurantDto);
      await this.restaurantRepository.persistAndFlush(restaurant);

      return this.mapper.map(restaurant, Restaurant, RestaurantDto);
    } catch (e: any) {
      throw new BadRequestException(
        `Restaurant cannot be created , ${e.message}`,
      );
    }
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantDto> {
    const restaurant = await this.restaurantRepository.findOne(
      { id },
      { populate: ['categories'] },
    );
    if (!restaurant) throw new BadRequestException("Restaurant doesn't exists");

    restaurant.description =
      updateRestaurantDto.description ?? restaurant.description;

    if (updateRestaurantDto.categories) {
      const categories = await this.categoryRepository.find({
        id: { $in: updateRestaurantDto.categories },
      });

      restaurant.categories.set(categories);
    }

    await this.restaurantRepository.persistAndFlush(restaurant);

    return this.mapper.map(restaurant, Restaurant, RestaurantDto);
  }

  async delete(id: number): Promise<boolean> {
    const restaurant = await this.restaurantRepository.findOne(
      { id },
      { populate: ['items'] },
    );
    if (!restaurant) throw new BadRequestException("Restaurant doesn't exists");

    await this.restaurantRepository.removeAndFlush(restaurant);
    return true;
  }

  async compareOwner(ownerId: number, restaurantId: number): Promise<boolean> {
    const restaurant = await this.restaurantRepository.findOne({
      id: restaurantId,
    });
    if (!restaurant) throw new BadRequestException("Restaurant doesn't exists");

    return restaurant.owner.id === ownerId;
  }
}
