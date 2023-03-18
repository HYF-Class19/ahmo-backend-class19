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
}
