import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any): Promise<LoginResponseDto> {
    const payload = { username: user.username, id: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
