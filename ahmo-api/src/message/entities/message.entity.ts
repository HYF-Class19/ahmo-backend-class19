import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ChatEntity } from '../../chat/entities/chat.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    onDelete: 'CASCADE'
  })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages, {
    onDelete: 'CASCADE',
  })
  sender: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}