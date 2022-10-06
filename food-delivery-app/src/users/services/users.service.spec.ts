import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.model';
import { UsersService } from './users.service';
import * as AuthHelper from '../../auth/utils/auth-helper';
import * as UserMocks from '../../../test/mocks/user.mock';
import { UserRole } from '../user-role';
import { MainAutomapperProfile } from '../../main.automapper-profile';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: EntityRepository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  let createUserMock;
  let userMock;
  let userDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        MainAutomapperProfile,
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<EntityRepository<User>>(USER_REPOSITORY_TOKEN);
  });

  beforeEach(() => {
    createUserMock = UserMocks.createUserMock();
    userMock = UserMocks.userMock();
    userDtoMock = UserMocks.userDtoMock();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('User Repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMock);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    });
    it('should encode password correctly', async () => {
      jest
        .spyOn(AuthHelper, 'hashPassword')
        .mockReturnValue(Promise.resolve('hashedpassword'));
      await service.create(createUserMock);

      expect(AuthHelper.hashPassword).toHaveBeenCalledWith(
        createUserMock.password,
      );
    });

    it('should call userRepository.create with correct params', async () => {
      await service.create(createUserMock);

      expect(userRepository.create).toHaveBeenCalledWith({
        username: createUserMock.username,
        role: createUserMock.accountType,
        password: expect.anything(),
      });
    });
    it('should call userRepository.persistAndFlush with correct params', async () => {
      await service.create(createUserMock);

      expect(userRepository.persistAndFlush).toHaveBeenCalledWith(userMock);
    });
    it('should call userRepository.findOne with correct params', async () => {
      await service.create(createUserMock);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: createUserMock.username,
      });
    });
    it('should throw BadRequestException if username already exists', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue({});

      await expect(service.create(createUserMock)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      return jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(userMock));
    });
    it('should return correct UserDto', async () => {
      const user = await service.findOne(userMock.id);

      expect(user).toEqual(userDtoMock);
    });
    it('should throw NotFoundException when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      await expect(service.findOne(userMock.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('findOneByUsername', () => {
    beforeEach(() => {
      return jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(userMock));
    });
    it('should return correct UserDto', async () => {
      const user = await service.findOneByUsername('user1');

      expect(user).toEqual(userDtoMock);
    });
    it('should throw NotFoundException when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      await expect(service.findOneByUsername('user1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest
        .spyOn(AuthHelper, 'hashPassword')
        .mockReturnValue(Promise.resolve('hashedpassword'));
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(userMock));
    });

    it('should update User and return as UserDto', async () => {
      const user = await service.update(1, { password: 'newPass' });

      expect(user).toEqual(userDtoMock);
    });

    it('should throw NotFoundException when user does not exists', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      await expect(
        service.update(1, { password: 'newPass' }),
      ).rejects.toThrowError(NotFoundException);
    });
    it('should call usersRepository.persistAndFlush with correct params', async () => {
      await service.update(1, { password: 'newPass' });

      expect(userRepository.persistAndFlush).toHaveBeenCalledWith({
        id: 1,
        username: 'user1',
        password: 'hashedpassword',
        role: UserRole.User,
        createdAt: new Date(1000000000000),
        ownedRestaurants: {},
        carts: {},
      });
    });
  });
  describe('validate', () => {
    beforeEach(() => {
      jest
        .spyOn(AuthHelper, 'comparePassword')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(userMock));
    });

    it('should return user without password when password belongs to user', async () => {
      const result = await service.validate('user1', 'pass1');

      expect(result).toEqual({
        id: 1,
        username: 'user1',
        role: UserRole.User,
        createdAt: new Date(1000000000000),
        ownedRestaurants: {},
        carts: {},
      });
    });

    it('should call usersRepository.findOne with correct params', async () => {
      await service.validate('user1', 'pass1');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'user1',
      });
    });
    it('should call comparePassword with correct params', async () => {
      await service.validate('user1', 'pass1');

      expect(AuthHelper.comparePassword).toHaveBeenCalledWith(
        'pass1',
        'hashedpassword',
      );
    });

    it('should return null when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      const result = await service.validate('user1', 'pass1');

      expect(result).toBe(null);
    });
    it('should return null when given password is incorrect', async () => {
      jest
        .spyOn(AuthHelper, 'comparePassword')
        .mockReturnValue(Promise.resolve(false));

      const result = await service.validate('user1', 'pass2');

      expect(result).toBe(null);
    });
  });
});
