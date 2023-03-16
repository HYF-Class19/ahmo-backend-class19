import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoundModule } from './round/round.module';
import { GamerModule } from './gamer/gamer.module';
import { GameModule } from './game/game.module';
import { ChatMemberModule } from './chat_member/chat_member.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    UserModule,
    ChatModule,
    ChatMemberModule,
    GameModule,
    GamerModule,
    RoundModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
