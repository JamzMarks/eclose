import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    @IsString()
    id!: string;
    
    name!: string;
    email!: string;
    role!: string
    password?: string;
}

