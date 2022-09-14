import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserDto } from '../../dto/user.dto';
import { UsersService } from '../../services/users.service';
import { UserRole } from '../../user-role';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { UserParam } from '../../../auth/user-param.decorator';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Get('is-username-taken/:username')
  async isUsernameTaken(@Param('username') username: string): Promise<boolean> {
    try {
      await this.usersService.findOneByUsername(username);
    } catch (e: any) {
      if (e.status === 404) {
        return false;
      }
    }
    return true;
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async updateSelf(
    @UserParam() userDto: UserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.usersService.update(userDto.id, updateUserDto);
  }
}
