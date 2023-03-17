import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MemberEntity } from '../../member/entities/member.entity';
import { RoundEntity } from '../../round/entities/round.entity';
import { MoveEntity } from '../../move/entities/move.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MemberEntity, (member) => member.user)
  members: MemberEntity[];

  @OneToMany(() => RoundEntity, (round) => round.riddler)
  riddlers: RoundEntity[];

  @OneToMany(() => MoveEntity, (move) => move.player)
  moves: MoveEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
