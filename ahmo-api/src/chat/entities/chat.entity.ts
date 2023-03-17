import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { MemberEntity } from '../../member/entities/member.entity';
import { RoundEntity } from '../../round/entities/round.entity';

export enum ChatType {
  DIRECT = "direct",
  GROUP = "group",
  GAME = "game"
}

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ChatType,
    default: ChatType.DIRECT
  })
  type: ChatType

  @Column()
  name: string;

  @OneToMany(() => MemberEntity, (member) => member.chat)
  members: MemberEntity[];

  @OneToMany(() => RoundEntity, (round) => round.game)
  rounds: RoundEntity[];

  @Column()
  game: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
