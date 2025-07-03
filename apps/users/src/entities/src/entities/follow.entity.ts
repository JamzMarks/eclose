// entity/follow.entity.ts
import { EntityType } from "src/types/entity.type";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['followerId', 'followedId',])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followerId: string;

  @Column()
  followedId: string;

  @CreateDateColumn()
  createdAt: Date;
}

