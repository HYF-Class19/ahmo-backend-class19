import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ChatEntity } from '../../chat/entities/chat.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: 0 })
  score: number;

  @ManyToOne(() => ChatEntity, (chat) => chat.members, { onDelete: 'CASCADE' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.members, { onDelete: 'CASCADE' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
