import { Injectable } from '@nestjs/common';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { MoveEntity } from './entities/move.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { RoundEntity } from '../round/entities/round.entity';
import { RoundService } from '../round/round.service';

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
    const round = await this.repositoryRound.findOne({
      where: { id: dto.roundId },
      relations: ['game', 'riddler', 'moves'],
    });

    if (round.game.game === 'words') {
      const word = dto.move_data.toLocaleLowerCase(); 
      const apiKey = 's8coetpxmv8wfdszh88zv2lmqqjukrd5mdz7ldnadnloqtbco'; 
      const accept = dto.last_word ? dto.last_word.trim().slice(-1).toLowerCase().toLowerCase() === dto.move_data.trim().slice(0,1).toLowerCase() : true
      const alreadyExist = round.moves?.find(m => m.move_data === dto.move_data)

      const url = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&api_key=${apiKey}`;

      // make the API request
      const response = await fetch(url)
      if(response.ok && accept && !alreadyExist) {
        const move = await this.repository.save({ ...dto, player: user, round});
        return {...move, correct: true}
      } else {
        return {error: !accept ? 'You have to name a word string from your opponents word\'s last letter' : alreadyExist ? 'you or your opponent alreasy named this word within this game' : 'The word does not exist',correct: false}
      }
    }

    const move = await this.repository.save({ ...dto, player: user, round});

    const isRight = move.move_data
      .toLowerCase()
      .split(' ')
      .includes(round.round_data);

    if (move.move_type === 'statement') {
      await this.roundService.addAttempt(round.id);
      if (isRight) {
        await this.roundService.update(round.id, {
          round_status: 'finished',
          round_winner: user.id,
          chatId: round.game.id,
        });
        return { ...move, correct: true };
      } else if (round.game.game === 'truth or dare') {
        await this.roundService.update(round.id, {
          round_status: 'finished',
          round_winner: round.riddler.id,
          chatId: round.game.id,
        });
        return { ...move, correct: false };
      }
      if (round.attempt + 1 >= 3) {
        await this.roundService.update(round.id, {
          round_status: 'finished',
          round_winner: round.riddler.id,
          chatId: round.game.id,
        });
        return { ...move, correct: false };
      }
    }

    return { ...move, correct: false };
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
