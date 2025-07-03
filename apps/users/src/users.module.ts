import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "./users.service";

import { KafkaProducerService } from "./services/KafkaProducer.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      TypeOrmModule.forRootAsync({
        useFactory: () => {
          const isProd = process.env.NODE_ENV === 'production';
          return isProd
            ? {
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT ?? '3306'),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [User],
                synchronize: true,
                autoLoadEntities: true,
              }
            : {
                type: 'sqlite',
                database: 'db.users',
                entities: [User],
                synchronize: true,
                autoLoadEntities: true,
          }}
      }),
      TypeOrmModule.forFeature([User]),
    ],
    controllers: [UsersController],
    providers: [UsersService, KafkaProducerService],
    exports: [],
})
export class UsersModule {}