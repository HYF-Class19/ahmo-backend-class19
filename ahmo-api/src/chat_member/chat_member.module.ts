import { Module } from '@nestjs/common';
import { ChatMemberService } from './chat_member.service';
import { ChatMemberController } from './chat_member.controller';

@Module({
  controllers: [ChatMemberController],
  providers: [ChatMemberService]
})
export class ChatMemberModule {}
