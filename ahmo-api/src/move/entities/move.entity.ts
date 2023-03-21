import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RoundEntity } from '../../round/entities/round.entity';

@Entity()
export class MoveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  move_data: string;

  @Column()
  move_type: string;

  @ManyToOne(() => RoundEntity, (round) => round.moves, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  round: RoundEntity;

  @ManyToOne(() => UserEntity, (user) => user.moves, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  player: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
