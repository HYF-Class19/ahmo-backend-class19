import {Controller, Get, Post, Body, Request, Patch, Param, Delete, UseGuards, Query} from "@nestjs/common";
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateChatDto, @Request() req) {
    return this.chatService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  findChatsByUserId(@Request() req, @Query('game') game: boolean) {
    if(game) {
      return this.chatService.findGamesByUserId(req.user.id);
    }
    return this.chatService.findChatsByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
