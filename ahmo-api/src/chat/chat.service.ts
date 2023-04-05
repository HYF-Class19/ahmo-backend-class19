import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatEntity } from "./entities/chat.entity";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { MemberEntity } from "../member/entities/member.entity";
import { UserService } from "../user/user.service";
import {RoundService} from "../round/round.service";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private repository: Repository<ChatEntity>,
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
    private userService: UserService,
    private roundService: RoundService,
  ) {}

  async create(createChatDto: CreateChatDto, user: UserEntity): Promise<ChatEntity> {
    const chat = new ChatEntity();

    if(createChatDto.game) {
      chat.game = createChatDto.game
    }

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
    const createdChat = await this.repository.save(chat);

    if(createChatDto.game) {
        await this.roundService.create({chatId: createdChat.id, riddlerId: createdChat.admin.id})
      return this.repository.save(createdChat);
    }

    return createdChat;
  }

  async findAll() {
    const qb = await this.repository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoin('chat.messages', 'messages', 'messages.id = (SELECT MAX(id) FROM messages WHERE chatId = chat.id)')
      .orderBy('messages.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(id: number) {
    if(!id) return 
    const chat = await this.repository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'messages', 'messages.sender', 'admin', 'rounds', 'rounds.riddler', 'rounds.moves'],
    });

    const sortedMessages = chat.messages.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    });

    return {...chat, messages: sortedMessages }
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async findChatsByUserId(userId: number, query?: string) {
    if(!userId) return 
    const qb = this.repository.createQueryBuilder('chat');
    qb.leftJoinAndSelect('chat.members', 'chatMembers');
    qb.leftJoinAndSelect('chatMembers.user', 'chatMembersUser');
    qb.leftJoinAndSelect('chat.messages', 'chatMessages')
    qb.leftJoinAndSelect('chatMessages.sender', 'sender')
    .orderBy('chatMessages.createdAt', 'DESC');
    qb.where('chatMembersUser.id = :currentUserId', { currentUserId: userId });
    let chats = await qb.getMany();

    chats = chats.map(chat => {
      const lastMessage = chat.messages.length ? chat.messages[0] : null;
      delete chat.messages;
      return {
        ...chat,
        lastMessage
      }
    })
    return chats;
  }

  findGamesByUserId(id: number, query?: string) {
    const qb = this.repository.createQueryBuilder('chat');
    qb.leftJoin('chat.members', 'member');
    qb.leftJoin('member.user', 'user');
    qb.where('user.id = :currentUserId', { currentUserId: id });
    qb.leftJoin('chat.messages', 'messages')
    .orderBy('messages.createdAt', 'DESC');
    qb.leftJoinAndSelect('chat.members', 'chatMembers');
    qb.leftJoinAndSelect('chatMembers.user', 'chatMembersUser');
    qb.leftJoinAndSelect('chat.rounds', 'rounds');
    qb.where('chat.type = :type', { type: 'game' })
    qb.where('user.id = :currentUserId', { currentUserId: id });
    qb.andWhere('chat.type = :type', { type: 'game' })

    return qb.getMany();
  }
  searchChats(id: number, queries: {query: string, type: string}) {

    const qb = this.repository.createQueryBuilder('chat');
    qb.leftJoinAndSelect('chat.members', 'chatMembers');
    qb.leftJoinAndSelect('chatMembers.user', 'chatMembersUser');
    qb.leftJoinAndSelect('chat.rounds', 'rounds');
    qb.leftJoin('chat.members', 'member');
    qb.leftJoin('member.user', 'user');
    qb.where('user.id = :currentUserId', { currentUserId: id });
    qb.andWhere('chat.name LIKE :name', { name: `%${queries.query}%`})

    if(queries.type !== 'all') {
      qb.andWhere('chat.type = :type', { type: queries.type })
    } else {
      qb.andWhere('chat.type != :type', { type: 'direct' })
    }
    
    return qb.getMany();
  }
}
