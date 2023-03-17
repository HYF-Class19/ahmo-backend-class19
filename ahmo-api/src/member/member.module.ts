import { Module } from '@nestjs/common';
import { ChatMemberService } from './member.service';
import { ChatMemberController } from './member.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberEntity } from "./entities/member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [ChatMemberController],
  providers: [ChatMemberService]
})
export class ChatMemberModule {}
