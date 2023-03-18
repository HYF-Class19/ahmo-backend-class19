import { IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  text: string;
  @IsNumber()
  chatId: number;
}
