
// Reexporte os DTOs:
export * from './dtos/auth.dto';
export * from './dtos/user.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export const helloCommon = () => 'Olá do common!';
