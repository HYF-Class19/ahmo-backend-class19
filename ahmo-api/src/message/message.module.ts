import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./entities/message.entity";
import { ChatEntity } from "../chat/entities/chat.entity";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [
   TypeOrmModule.forFeature([MessageEntity, ChatEntity, UserEntity]),
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
