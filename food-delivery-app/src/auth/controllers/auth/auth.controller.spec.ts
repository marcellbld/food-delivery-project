import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../services/auth.service';
import * as UserMocks from '../../../../test/mocks/user.mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  let userDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    userDtoMock = UserMocks.userDtoMock;
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    beforeEach(() => {
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ access_token: 'accessToken' });
    });

    it('should return accessToken', async () => {
      const result = await controller.login({ user: userDtoMock });

      expect(result).toEqual({ access_token: 'accessToken' });
    });

    it('should call authService.login with correct params', async () => {
      await controller.login({ user: userDtoMock });

      expect(authService.login).toHaveBeenCalledWith(userDtoMock);
    });
  });
});
