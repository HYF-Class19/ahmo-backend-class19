import {Controller, Get, Post,Request, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { MoveService } from './move.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('moves')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMoveDto: CreateMoveDto, @Request() req) {
    return this.moveService.create(createMoveDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.moveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoveDto: UpdateMoveDto) {
    return this.moveService.update(+id, updateMoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moveService.remove(+id);
  }
}
