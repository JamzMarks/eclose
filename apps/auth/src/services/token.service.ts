
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/utils/interfaces/jwtPayload.interface';

@Injectable()
export class TokenService {
  private jwtExpirationTime: number;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTime =
      this.configService.get<number>('JWT_EXPIRATION_TIME') || 3600;
  }

  sign(payload: JwtPayload, expiresIn: string | number): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  //arrumar
  verify<T = any>(token: string): any {
    return this.jwtService.verify(token);
  }

  decode(token: string): JwtPayload | null {
    return this.jwtService.decode(token) as JwtPayload | null;
  }

  getAccessAndRefreshTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${this.jwtExpirationTime}s`,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      jwtExpirationTime: this.jwtExpirationTime,
    }
  }
}
