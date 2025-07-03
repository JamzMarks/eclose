import { Module } from '@nestjs/common';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';

// @Module({
//   imports: [ConfigModule.forRoot({
//     isGlobal: true,
//     envFilePath: '.env',
//   }),
//   TypeOrmModule.forRootAsync({
//     useFactory: async (configService: ConfigService) => {
//       const isProd = process.env.NODE_ENV === 'production';
//       return isProd
//         ? {
//             type: 'mysql',
//             host: configService.get<string>('DB_HOST', 'localhost'),
//             port: parseInt(process.env.DB_PORT ?? '3306'),
//             username: process.env.DB_USERNAME,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME,
//             entities: [Follow],
//             synchronize: true,
//             autoLoadEntities: true,
//           }
//         : {
//             type: 'sqlite',
//             database: 'db.follows',
//             entities: [Follow],
//             synchronize: true,
//             autoLoadEntities: true,
//           };
//     },
//   }),
//   TypeOrmModule.forFeature([Follow]),
// ],
//   controllers: [FollowsController],
//   providers: [FollowsService],
// })
// export class FollowsModule {}


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
                entities: [Follow],
                synchronize: true,
                autoLoadEntities: true,
              }
            : {
                type: 'sqlite',
                database: 'db.follow',
                entities: [Follow],
                synchronize: true,
                autoLoadEntities: true,
          }}
      }),
      TypeOrmModule.forFeature([Follow]),
    ],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}