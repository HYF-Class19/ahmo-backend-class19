import { Controller } from '@nestjs/common';
import { ChatMemberService } from './chat_member.service';

@Controller('chat-member')
export class ChatMemberController {
  constructor(private readonly chatMemberService: ChatMemberService) {}
}
