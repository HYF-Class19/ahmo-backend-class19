import { Injectable } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {RoundEntity} from "./entities/round.entity";
import {Repository} from "typeorm";
import {MemberService} from "../member/member.service";
import {UserService} from "../user/user.service";
import {ChatEntity} from "../chat/entities/chat.entity";

@Injectable()
export class RoundService {
  constructor(
      @InjectRepository(RoundEntity)
        private repository: Repository<RoundEntity>,
      @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,

      private memberService: MemberService,
      private userService: UserService,
  ) {}

  async create(createRoundDto: CreateRoundDto) {
    const game = await this.chatRepository.findOne({where: {id: createRoundDto.chatId}})

    const riddler = await this.userService.findOne(createRoundDto.riddlerId)

    // @ts-ignore
    const round = await this.repository.save({
      game,
      riddler,
      round_status: 'active'
    });
    return round;
  }

  async findAll(gameId: number) {
    const qb = await this.repository.createQueryBuilder('round')
    qb.leftJoin('round.game', 'game')
    qb.where('game.id = :gameId', {gameId})
    qb.orderBy('round.id', 'DESC')
    qb.leftJoinAndSelect('round.moves', 'moves')
    qb.leftJoinAndSelect('moves.riddler', 'riddler')

    return qb.getMany()
  }

  findOne(id: number) {
    return this.repository.findOne({where: {id}, relations: ['moves', 'riddler', 'game']})
  }

  async update(id: number, dto: any) {
    if(dto.round_data) {
        return this.repository.update(id, {round_data: dto.round_data.toLowerCase()})
    }
    if(dto.round_status && dto.round_winner) {
        await this.repository.update(id, {round_status: dto.round_status})

        await this.memberService.addScore(dto.round_winner, dto.chatId)

        return this.repository.update(id, {round_winner: dto.round_winner})
    }
  }

  remove(id: number) {
    return `This action removes a #${id} round`;
  }
}
