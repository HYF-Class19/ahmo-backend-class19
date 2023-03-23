import { Injectable } from '@nestjs/common';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import {MoveEntity} from "./entities/move.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import {RoundEntity} from "../round/entities/round.entity";
import {RoundService} from "../round/round.service";

@Injectable()
export class MoveService {
  constructor(
     @InjectRepository(MoveEntity)
        private repository: Repository<MoveEntity>,
     @InjectRepository(RoundEntity)
        private repositoryRound: Repository<RoundEntity>,
     private userService: UserService,
     private roundService: RoundService,
  ) {}

  async create(dto: CreateMoveDto, userId: number) {
    const user = await this.userService.findById(userId);
    const round = await this.repositoryRound.findOne({where: {id: dto.roundId,}, relations: ['game']})

    const move = await this.repository.save({...dto, player: user, round});

      const isRight = move.move_data.toLowerCase().split(' ').includes(round.round_data)

    if(move.move_type === 'statement') {
        if(isRight) {
            await this.roundService.update(round.id, {round_status: 'finished', round_winner: user.id, chatId: round.game.id})
            return {...move, correct: true}
        }
    }

    return {...move, correct: isRight}
  }



  findAll() {
    return `This action returns all move`;
  }

  findOne(id: number) {
    return `This action returns a #${id} move`;
  }

  update(id: number, updateMoveDto: UpdateMoveDto) {
    return `This action updates a #${id} move`;
  }

  remove(id: number) {
    return `This action removes a #${id} move`;
  }
}
