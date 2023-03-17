import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoundModule } from './round/round.module';
import { ChatMemberModule } from './member/member.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoveModule } from './move/move.module';
import { UserEntity } from "./user/entities/user.entity";
import { RoundEntity } from "./round/entities/round.entity";
import { MoveEntity } from "./move/entities/move.entity";
import { MemberEntity } from "./member/entities/member.entity";
import { ChatEntity } from "./chat/entities/chat.entity";
import { AuthModule } from "./auth/auth.module";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'podnes',
      database: 'ahmo',
      entities: [UserEntity, RoundEntity, MoveEntity, MemberEntity, ChatEntity],
      synchronize: true,
    }),
    UserModule,
    ChatModule,
    ChatMemberModule,
    RoundModule,
    MoveModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
