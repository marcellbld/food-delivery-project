import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { comparePassword, hashPassword } from '../../auth/utils/auth-helper';
import { User } from '.././entities/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserAddressDto } from '../dto/update-user-address.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { UserDto } from '../dto/user.dto';
import { UserRole } from '../user-role';

@Injectable()
export class UsersService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(User) private usersRepository: EntityRepository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserDto> {
    if (
      await this.usersRepository.findOne({
        username: userDto.username,
      })
    )
      throw new BadRequestException('User already exists with this username');

    if (userDto.accountType === UserRole.User && !userDto.address) {
      throw new BadRequestException('Address is required');
    }
    const user = this.usersRepository.create({
      username: userDto.username,
      role: userDto.accountType,
      password: await hashPassword(userDto.password),
      addressLon: userDto.address == null ? null : userDto.address[0],
      addressLat: userDto.address == null ? null : userDto.address[1],
    });
    await this.usersRepository.persistAndFlush(user);
    return this.mapper.map(user, User, UserDto);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User doesn't exists with id (#${id})`);
    }

    return this.mapper.map(user, User, UserDto);
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new NotFoundException(
        `User doesn't exists with username (#${username})`,
      );
    }

    return this.mapper.map(user, User, UserDto);
  }

  async updatePassword(
    id: number,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User doesn't exists with id (#${id})`);
    }

    user.password = await hashPassword(updateUserPasswordDto.password);

    await this.usersRepository.persistAndFlush(user);

    return this.mapper.map(user, User, UserDto);
  }
  async updateAddress(
    id: number,
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User doesn't exists with id (#${id})`);
    }

    const address = updateUserAddressDto.address;
    user.addressLon = address[0];
    user.addressLat = address[1];

    await this.usersRepository.persistAndFlush(user);

    return this.mapper.map(user, User, UserDto);
  }

  async validate(username: string, password: string) {
    const user = await this.usersRepository.findOne({ username });

    if (user && (await comparePassword(password, user.password))) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }
}
