import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserEntity } from "../user/entities/user.entity";
import { MessageEntity } from "./entities/message.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private repository: Repository<MessageEntity>
  ) {
  }

  async create(createMessageDto: CreateMessageDto, sender: UserEntity) {
    const chat = await this.repository.findOne({where: {id: createMessageDto.chatId}})
    return this.repository.save({
      ...createMessageDto,
      chat,
      sender
    })
  }

  findAll() {
    return `This action returns all message`;
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
