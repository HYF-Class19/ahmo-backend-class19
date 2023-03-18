import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatEntity } from "./entities/chat.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { MemberEntity } from "../member/entities/member.entity";
import { UserService } from "../user/user.service";
import { classToPlain, plainToClass } from "class-transformer";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private repository: Repository<ChatEntity>,
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
    private userService: UserService,
  ) {
  }

  async create(createChatDto: CreateChatDto, user: UserEntity): Promise<ChatEntity> {
    const chat = new ChatEntity();
    chat.name = createChatDto.name;
    chat.type = createChatDto.type;
    chat.admin = user;
    const group = createChatDto.members.split(',').map(memberId => +memberId)

    const memberPromises = group.map(async memberId => {
      const member = new MemberEntity();
      member.user = await this.userService.findOne(memberId);
      member.chat = chat;
      return this.memberRepository.save(member);
    });
    const members = await Promise.all(memberPromises);
    chat.members = members;

    console.log(chat)
    return this.repository.save(chat);
  }

  async findAll() {
    const qb = await this.repository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .leftJoinAndSelect('member.user', 'user');

    return qb.getMany()
  }

  async findOne(id: number) {
    const qb = await this.repository.createQueryBuilder('chat')
    const chat = await qb.leftJoinAndSelect(
      'chat.messages',
      'message',
    ).where('chat.id = :id', {id}).getOne();

    return chat
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
