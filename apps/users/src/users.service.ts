import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
// import { CreateUserDto } from '@app/common/dtos/user/create-user.dto';
import { KafkaProducerService } from './services/KafkaProducer.service';
import { EmptyUserDto } from './utils/dto/emptyUser.dto';
import { User } from './entities/user.entity';
import { UserDto } from './utils/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly kafka: KafkaProducerService,
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // async findAll(): Promise<User[]> {
  //   return await this.repo.find({
  //     skip: 0,
  //     take: 20,
  //     order: { username: 'ASC' },
  //   });
  // }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // async findUserByEmail(email: string): Promise<User | null> {
  //   return await this.repo.findOne({
  //     where: { email: email.trim().toLowerCase() },
  //   });
  // }

  // async findUserByUsername(username: string): Promise<User | null> {
  //   return await this.repo.findOne({ where: { username } });
  // }

  // async createUser(user: any): Promise<any> {
  //   console.log('Creating user: fui chamado', user);
  //   const newUser = this.repo.create({
  //     ...user,
  //   });
  //   return await this.repo.save(newUser);
  // }

  

  async deleteUser(id: string): Promise<DeleteResult> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    return result;
  }
  
  async createEmptyProfile(user: EmptyUserDto): Promise<any> {
    console.log('Creating empty user profile:', user);
    const newUser = this.repo.create({
      userId: user.id,
      username: user.username,
    });
    return await this.repo.save(newUser);
  }

  async updateUser(id: string, user: Partial<UserDto>): Promise<User> {
    const existingUser = await this.repo.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = Object.assign(existingUser, user);

    return this.repo.save(updatedUser);
  }

  async checkHelth(): Promise<string> {
    await this.kafka.emit('usersHealth_checked', {
      timestamp: new Date().toISOString(),
      service: 'auth',
      status: 'ok',
    });

    return 'User MS is running';
  }
}
