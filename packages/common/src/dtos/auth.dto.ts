import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto {
    
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @MinLength(8)
    password!: string;
}