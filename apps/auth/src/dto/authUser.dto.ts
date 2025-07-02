interface AuthUserDto {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  isVerified: boolean;
  roles: string[];
  createdAt: Date;
  lastLogin?: Date;
}