import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MainAutomapperProfile } from '../../main.automapper-profile';
import * as UserMocks from '../../../test/mocks/user.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  let userMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        MainAutomapperProfile,
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    userMock = UserMocks.userMock();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('JwtService should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    beforeEach(() => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('JwtAccessToken');
    });

    it('should return correct LoginResponseDto object and return accessToken', async () => {
      const result = await service.login(userMock);

      expect(result).toEqual({ access_token: 'JwtAccessToken' });
    });

    it('should call jwtService.sign with correct params', async () => {
      await service.login(userMock);

      expect(jwtService.sign).toBeCalledWith({
        username: userMock.username,
        id: userMock.id,
        role: userMock.role,
      });
    });
  });
});
