import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../services/users.service';
import { UsersController } from './users.controller';
import * as UserMocks from '../../../../test/mocks/user.mock';
import { UserRole } from '../../user-role';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  let createUserMock;
  let userDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockReturnValue(UserMocks.userDtoMock()),
            findOne: jest.fn().mockReturnValue(UserMocks.userDtoMock()),
            findOneByUsername: jest
              .fn()
              .mockReturnValue(UserMocks.userDtoMock()),
            update: jest.fn().mockReturnValue(UserMocks.userDtoMock()),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    createUserMock = UserMocks.createUserMock();
    userDtoMock = UserMocks.userDtoMock();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    it('should get a user by ID', async () => {
      const user = await controller.findOne(1);
      expect(user).toEqual({
        id: 1,
        username: 'user1',
        role: UserRole.User,
        createdAt: new Date(1000000000000),
      });
    });
    it('should call usersService.findOne with correct params', async () => {
      await controller.findOne(1);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
    });
  });
  describe('isUsernameTaken', () => {
    it('should return true if user found by username', async () => {
      const result = await controller.isUsernameTaken('user1');
      expect(result).toBeTruthy();
    });
    it('should return false if user not found by username', async () => {
      usersService.findOneByUsername = jest.fn().mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      const result = await controller.isUsernameTaken('user1');
      expect(result).toBeFalsy();
    });
    it('should call usersService.findOneByUsername with correct params', async () => {
      await controller.isUsernameTaken('user1');

      expect(usersService.findOneByUsername).toHaveBeenCalledWith('user1');
    });
  });
  describe('create', () => {
    it('should return the created user', async () => {
      const user = await controller.create(createUserMock);

      expect(user).toEqual(userDtoMock);
    });
    it('should call usersService.create with correct params', async () => {
      await controller.create(createUserMock);

      expect(usersService.create).toHaveBeenCalledWith(createUserMock);
    });
  });
  describe('updateSelf', () => {
    it('should return updated user', async () => {
      const user = await controller.updateSelf(userDtoMock, {
        password: 'newPass',
      });

      expect(user).toEqual(userDtoMock);
    });
    it('should call usersService.update with correct params', async () => {
      const updateUserDto = {
        password: 'newPass',
      };
      await controller.updateSelf(userDtoMock, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(
        userDtoMock.id,
        updateUserDto,
      );
    });
  });
});
