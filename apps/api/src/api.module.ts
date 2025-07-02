import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
// import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';


// import { EventsController } from './controllers/events.controller';
// import { VenueController } from './controllers/venue.controller';
// import { JwtAuthModule } from './module/jwt.module';
// import { KafkaGatewayController } from './controllers/kafka-gateway.controller';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';


@Module({
  imports: [
    HttpModule,
    // JwtAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [
    ApiController,
    // UserController,
    AuthController,
    // EventsController,
    // VenueController,
    // KafkaGatewayController
  ],
  providers: [ApiService
    
  ],
})
export class ApiModule {}
