import { ChatType } from "../entities/chat.entity";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateChatDto {
  @IsString()
  type: ChatType

  @IsString()
  name: string;

  @IsString()
  members: string;

  @IsOptional()
  @IsString()
  game: string;
}
