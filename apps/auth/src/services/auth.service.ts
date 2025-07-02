
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hashSync } from 'bcrypt';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from '../repository/authUser.entity';
import { KafkaProducerService } from './KafkaProducer.service';
import { TokenService } from './token.service';
import { CreateUserDto, JwtPayload } from '@e-close/common';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly repo: Repository<AuthUser>,
    private readonly kafka: KafkaProducerService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.repo.findOne({
      where: { email: normalizedEmail },
      select: ['id', 'email', 'password'],
    });

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken, jwtExpirationTime } =
      this.tokenService.getAccessAndRefreshTokens(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: jwtExpirationTime,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async signUp(userDto: CreateUserDto): Promise<AuthResponseDto> {
    const normalizedEmail = userDto.email.trim().toLowerCase();

    const existing = await this.repo.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Email já está em uso',
        },
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.repo.create({
      ...userDto,
      email: normalizedEmail,
      password: hashSync(userDto.password, 10),
    });

    const savedUser = await this.repo.save(newUser);

    const payload: JwtPayload = {
      sub: savedUser.id,
      email: savedUser.email,
    };

    const { accessToken, refreshToken, jwtExpirationTime } =
      this.tokenService.getAccessAndRefreshTokens(payload);
    const token = this.tokenService.sign(payload, '1h');

    await this.kafka.emit('user-created', {
      id: savedUser.id,
      email: savedUser.email,
      token: token,
      username: savedUser.username,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: jwtExpirationTime,
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = await this.tokenService.verify<JwtPayload>(refreshToken);

      const user = await this.repo.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
      };

      const newTokens = this.tokenService.getAccessAndRefreshTokens(newPayload);

      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresIn: newTokens.jwtExpirationTime,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.tokenService.verify(token);
      const user = await this.repo.findOneBy({ id: decoded.sub });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      user.isVerified = true;
      await this.repo.save(user);

      return 'Email verificado com sucesso!';
    } catch (err) {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }

  async getHealth() {
    await this.kafka.emit('created-user', {
      timestamp: new Date().toISOString(),
      service: 'auth',
      status: 'ok',
    });
    return { status: 'ok' };
  }
}
