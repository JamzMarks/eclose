import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        clientId: 'user-service',
      },
      consumer: {
        groupId: 'user-consumer-group',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003);
  console.log('User MS conectado ao RabbitMQ 🐇', process.env.PORT || 3003);
}
bootstrap();
