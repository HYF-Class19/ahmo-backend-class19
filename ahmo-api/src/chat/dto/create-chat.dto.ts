import { ChatType } from "../entities/chat.entity";
import { IsOptional, IsString } from "class-validator";

export class CreateChatDto {
  @IsString()
  type: ChatType

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  members: string;

  @IsOptional()
  @IsString()
  game: string;
}
