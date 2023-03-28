import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';

@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Post()
  create(@Body() createRoundDto: CreateRoundDto) {
    return this.roundService.create(createRoundDto);
  }

  @Get()
  findAllInGame(@Query('gameId') gameId: string) {
    return this.roundService.findAll(+gameId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('q') q: string) {
    return this.roundService.findOne(+id, q);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoundDto: UpdateRoundDto) {
    return this.roundService.update(+id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roundService.remove(+id);
  }
}
