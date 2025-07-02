import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        clientId: 'auth-service',
      },
      consumer: {
        groupId: 'auth-ms-consumer-group',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
  console.log('🚀 Auth API HTTP rodando na porta', process.env.PORT);
}
bootstrap();
