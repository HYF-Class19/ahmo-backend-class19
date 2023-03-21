import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoundEntity } from "./entities/round.entity";
import {MemberService} from "../member/member.service";
import {MemberEntity} from "../member/entities/member.entity";
import {UserEntity} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {ChatEntity} from "../chat/entities/chat.entity";
import {ChatService} from "../chat/chat.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoundEntity, MemberEntity, UserEntity, ChatEntity])],
  controllers: [RoundController],
  providers: [RoundService, MemberService, UserService, ChatService],
  exports: [RoundService]
})
export class RoundModule {}
