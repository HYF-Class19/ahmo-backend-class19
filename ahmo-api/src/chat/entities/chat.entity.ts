import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne, ManyToOne
} from "typeorm";
import { MemberEntity } from '../../member/entities/member.entity';
import { RoundEntity } from '../../round/entities/round.entity';
import { MessageEntity } from "../../message/entities/message.entity";
import { UserEntity } from "../../user/entities/user.entity";

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

  @Column({nullable: true})
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.adminChats, {
    onDelete: 'CASCADE'
  })
  admin: UserEntity;


  @OneToMany(() => MemberEntity, (member) => member.chat)
  members: MemberEntity[];

  @OneToMany(() => RoundEntity, (round) => round.game)
  rounds: RoundEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @Column({nullable: true})
  game: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
