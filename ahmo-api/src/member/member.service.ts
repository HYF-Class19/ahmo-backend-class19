import { Injectable } from '@nestjs/common';
import { MemberEntity } from "./entities/member.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    readonly repository: Repository<MemberEntity>,
  ) {
  }
  getAll() {
    return this.repository.find({relations: ['user', 'chat']});
  }

  async addScore(id: number, chatId: number) {
    const member = await this.repository.findOne({where: {user: {id}, chat: {id: chatId}}})
    member.score++;
    const user = await this.repository.update(member.id, {score: member.score});
    return user
  }
}
