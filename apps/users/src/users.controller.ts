import { Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { EmptyUserDto } from "./utils/dto/emptyUser.dto";
import { User } from "./entities/user.entity";
import { UserDto } from "./utils/dto/user.dto";
import { DeleteResult } from "typeorm";



@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    // @MessagePattern({ cmd: UserCommands.FIND_ALL })
    // getUsers(_: MicroserviceRequest): Promise<User[]>{
    //     return this.userService.findAll();
    // }
    
    

    // @MessagePattern({ cmd: UserCommands.FIND_BY_EMAIL })
    // findUserByEmail(email: string): Promise<User | null> {
    //     return this.userService.findUserByEmail(email);
    // }

    // @MessagePattern({ cmd: UserCommands.FIND_BY_EMAIL_WITH_PASSWORD })
    // findUserByEmailWithPassword(email: string): Promise<User | null> {
    //     return this.userService.findUserByEmailWithPassword(email);
    // }

    // @MessagePattern({ cmd: UserCommands.FIND_BY_USERNAME })
    // findUserByUsername(username: string): Promise<User | null> {
    //     return this.userService.findUserByUsername(username);
    // }

    // @MessagePattern({ cmd: UserCommands.CREATE })
    // createUser(@Body() user: CreateUserDto): Promise<User> {
    //     return this.userService.createUser(user);
    // }

    
    // @MessagePattern({ cmd: UserCommands.UPDATE })
    // updateUser(@Body() user: UserDto, id: string): Promise<User | null> {
    //     return this.userService.updateUser(id, user);
    // }

    // @MessagePattern({ cmd: UserCommands.DELETE })
    // deleteUser(@Body() id: string): Promise<void> {
    //     return this.userService.deleteUser(id);
    // }

    // @Get(':id')
    // findUserById(dto: DataMicroserviceRequest<string>): Promise<User | null> {
    //     return this.userService.findUserById(dto.data);
    // }

    @Get(':id')
    findUserById(@Param('id') id: string): Promise<User | null> {
        return this.userService.findUserById(id);
    }

    // @Post('create-user')
    // async createUser(@Body() user: UserDto): Promise<any> {
    //     return this.userService.createUser(user);
    // }

    @EventPattern('user-created')
    async createEmptyUser(@Payload() user: EmptyUserDto): Promise<void> {
        try {
            await this.userService.createEmptyProfile(user);
        } catch (error) {
            console.log('Error creating empty user profile:', error);
        }
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string,@Body() user: Partial<UserDto>): Promise<User> {
        return this.userService.updateUser(id, user);
    }
    
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return this.userService.deleteUser(id);
    }

    @Get()
    checkHealth(): Promise<string> {
        return this.userService.checkHelth()
    }
}
