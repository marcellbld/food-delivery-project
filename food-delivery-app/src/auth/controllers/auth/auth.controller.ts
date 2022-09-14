import {
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LoginExceptionFilter } from '../../exception-filters/login-exception.filter';
import { LoginResponseDto } from '../../dto/login-response.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from '../../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UseFilters(LoginExceptionFilter)
  async login(@Request() req: any): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }
}
