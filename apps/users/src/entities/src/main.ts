import { NestFactory } from '@nestjs/core';
import { FollowsModule } from './follows.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(FollowsModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client:{
        brokers: [process.env.BROKER || 'localhost:9092'],
        clientId: 'follows-service',
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP || 'follows-consumer-group',
      },  
    }
  })

  app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3006);
  console.log("🚀 Follows rodando na porta", process.env.PORT || 3006);
}
bootstrap();
