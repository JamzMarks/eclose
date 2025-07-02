import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false, select: false })
  isVerified: boolean;

  @Column('simple-array')
  roles: string[] = ['user'];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @Column({ type: 'timestamp', nullable: true })
  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ default: true })
  isActive: boolean;
}
