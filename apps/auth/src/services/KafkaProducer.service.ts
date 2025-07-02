import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs"

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async emit(topic: string, message: any) {
    console.log(`Enviando mensagem para o tópico ${topic}:`, message);
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
