import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox_events')
export class OutboxEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  topic: string;

  @Column('json')
  payload: Record<string, any>;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}
