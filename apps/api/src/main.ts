import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  
  // app.enableCors({
  //   origin: 'http://localhost:3001', // front
  //   credentials: true, // permitir cookies
  // });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true,
    // exceptionFactory: (errors) => {
    //   const formattedErrors = errors.map((err) => ({
    //     field: err.property,
    //     messages: Object.values(err.constraints || {}),
    //   }));
    //   return new BadRequestException({
    //     message: 'Erro de validação',
    //     details: formattedErrors,
    //   });
    // }
  }));
  app.use(cookieParser())
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // ou 'kafka:9092' se estiver em container
        clientId: 'api-gateway',
      },
      consumer: {
        groupId: 'api-gateway-group',
      },
    },
  });

  // Inicia os dois servidores: HTTP e Kafka
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
  console.log('Gateway rodando na porta 3000 🚀');
}
bootstrap();