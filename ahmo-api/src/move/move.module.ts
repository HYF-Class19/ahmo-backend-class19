import { Module } from '@nestjs/common';
import { MoveService } from './move.service';
import { MoveController } from './move.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MoveEntity } from "./entities/move.entity";
import {UserService} from "../user/user.service";
import {RoundEntity} from "../round/entities/round.entity";
import {UserEntity} from "../user/entities/user.entity";
import {RoundService} from "../round/round.service";
import {ChatEntity} from "../chat/entities/chat.entity";
import {ChatService} from "../chat/chat.service";
import {MemberService} from "../member/member.service";
import {MemberEntity} from "../member/entities/member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MoveEntity, RoundEntity, UserEntity, ChatEntity, MemberEntity])],
  controllers: [MoveController],
  providers: [MoveService, UserService, RoundService, ChatService, MemberService],
  exports: [MoveService]
})
export class MoveModule {}
