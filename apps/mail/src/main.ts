import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { MailModule } from "./mail.module";

async function  bootstrap(){
    const app = await NestFactory.create(MailModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [process.env.BROKER || 'localhost:9092'],
                clientId: "mail-service",
            },
            consumer: {
                groupId: "mail-consumer-group",
            },
        },
    })
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3005);
    console.log("🚀 Mail API HTTP rodando na porta", process.env.PORT || 3005);
}
bootstrap();
