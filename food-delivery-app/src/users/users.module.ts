import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users/users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.model';

@Module({
  controllers: [UsersController],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
