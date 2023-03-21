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
import { MoveEntity } from '../../move/entities/move.entity';

@Entity()
export class RoundEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  round_data: string;

  @Column()
  round_status: string;

  @Column({ nullable: true })
  round_winner: number;

  @ManyToOne(() => ChatEntity, (chat) => chat.rounds, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  game: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.riddlers, {
    onDelete: 'CASCADE',
  })
  riddler: UserEntity;

  @OneToMany(() => MoveEntity, (move) => move.round)
  moves: MoveEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
