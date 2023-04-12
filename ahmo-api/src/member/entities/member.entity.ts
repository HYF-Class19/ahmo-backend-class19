import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne, JoinColumn
} from "typeorm";
import { ChatEntity } from '../../chat/entities/chat.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Exclude } from "class-transformer";

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: 0 })
  score: number;

  @ManyToOne(() => ChatEntity, (chat) => chat.members, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'chat_id' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.members)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  toJSON() {
    const { chat, ...result } = this;
    return result;
  }
}
