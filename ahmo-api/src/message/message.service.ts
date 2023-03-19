import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserEntity } from "../user/entities/user.entity";
import { MessageEntity } from "./entities/message.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../chat/entities/chat.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private repository: Repository<MessageEntity>,
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
  }

  async create(createMessageDto: CreateMessageDto, senderId: number) {
    const chat = await this.chatRepository.findOne({where: {id: createMessageDto.chatId}})
    const sender = await this.userRepository.findOne({where: {id: senderId}})
    return this.repository.save({
      ...createMessageDto,
      chat,
      sender
    })
  }

  findAll() {
    return this.repository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
