// // auth.module.ts (ou api.module.ts, dependendo)
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'), 
//         signOptions: { expiresIn: '3600s' },
//       }),
//     }),
//   ],
//   exports: [JwtModule],
// })
// export class JwtAuthModule {}
