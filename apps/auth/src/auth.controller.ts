import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Payload } from '@nestjs/microservices';
import { LoginDto } from '@e-close/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Payload() user: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(user.email, user.password);
  }
  
  @Post('signup')
  signUp(@Payload() user: any): Promise<any> {
    return this.authService.signUp(user);
  }

  @Post('logout')
  async refreshToken(
    @Payload('refreshToken') refreshToken: string,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('verify-email')
  async verifyEmail(@Payload('token') token: string): Promise<string> {
    return this.authService.verifyEmail(token);
  }
  
  @Get('health')
  getHealth() {
    return this.authService.getHealth();
  }
}
