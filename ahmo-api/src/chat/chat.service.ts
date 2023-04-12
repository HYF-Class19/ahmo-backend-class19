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
import { MessageEntity } from 'src/message/entities/message.entity';
import { MoveEntity } from 'src/move/entities/move.entity';

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

    if(createChatDto.name) {
      chat.name = createChatDto.name;
    }
    
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
      await this.roundService.create({chatId: createdChat.id, riddlerId: createdChat.admin.id, submiting: 2})
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
      relations: ['members', 'members.user', 'messages', 'messages.sender', 'admin', 'rounds', 'rounds.riddler', 'rounds.moves', 'rounds.moves.player'],
    });

    const sortedMessages = chat.messages.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    });

    const sortedRounds = chat.rounds.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    });

    return {...chat, messages: sortedMessages, rounds: sortedRounds }
  }

  async update(id: number, memberId: number) {
    return 'update chat'
  }

  remove(id: number) {
    return this.repository.delete(id)
  }

  async findChatsByUserId(userId: number, query?: string) {
    if(!userId) return 
    const qb = this.repository.createQueryBuilder('chat');
    qb.leftJoinAndSelect('chat.messages', 'chatMessages')
    qb.leftJoinAndSelect('chatMessages.sender', 'sender')
    qb.leftJoinAndSelect('chat.members', 'members');
    qb.leftJoinAndSelect('members.user', 'user');
    qb.leftJoinAndSelect('chat.rounds', 'rounds');
    qb.leftJoinAndSelect('rounds.moves', 'moves')
    .orderBy('chatMessages.createdAt', 'DESC');
    qb.where('user.id = :currentUserId', { currentUserId: userId });
    let chats = await qb.getMany();

    for (const chat of chats) {
      await this.repository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.members', 'members')
        .leftJoinAndSelect('members.user', 'user')
        .where('chat.id = :chatId', { chatId: chat.id })
        .getOne()
        .then((populatedChat) => {
          chat.members = populatedChat.members;
        });
    }

    chats = chats.map(chat => {
      let lastMessage: MessageEntity
      let lastMove: MoveEntity
      let status: string
      if(chat.type !== 'game') {
        lastMessage = chat.messages.length ? chat.messages[0] : null; 
      } else {
        const lastRound = chat.rounds.length ? chat.rounds[0] : null;
        status = lastRound.submiting >= 2 ? 'started' : 'not started'
        lastMove = lastRound.moves.length ? lastRound.moves[lastRound.moves.length - 1] : null
      }

      delete chat.messages;
      delete chat.rounds
      return {
        ...chat,
        lastMessage,
        lastMove,
        status
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
