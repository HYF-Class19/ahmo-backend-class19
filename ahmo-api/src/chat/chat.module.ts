import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { UserService } from "../user/user.service";
import { MemberEntity } from "../member/entities/member.entity";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, MemberEntity, UserEntity])],
  controllers: [ChatController],
  providers: [ChatService, UserService],
  exports: [ChatService]
})
export class ChatModule {}
