import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import {MemberController } from './member.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberEntity } from "./entities/member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule {}
