export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}
