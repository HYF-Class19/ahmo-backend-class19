import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { UserService } from "../user/user.service";
import { MemberEntity } from "../member/entities/member.entity";
import { UserEntity } from "../user/entities/user.entity";
import {RoundEntity} from "../round/entities/round.entity";
import {RoundService} from "../round/round.service";
import {MemberService} from "../member/member.service";

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, MemberEntity, UserEntity, RoundEntity])],
  controllers: [ChatController],
  providers: [ChatService, UserService, RoundService, MemberService],
  exports: [ChatService]
})
export class ChatModule {}
