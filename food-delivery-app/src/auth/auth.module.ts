import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '../users/entities/user.model';
import { jwtConstants } from './constants';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersModule } from '../users/users.module';
import { LoginExceptionFilter } from './exception-filters/login-exception.filter';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '36000s' },
    }),
    UsersModule,
  ],
  providers: [AuthService, LoginExceptionFilter, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
