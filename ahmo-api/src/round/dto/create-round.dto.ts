import {IsNumber, IsString} from "class-validator";

export class CreateRoundDto {
    @IsNumber()
    riddlerId: number;

    @IsNumber()
    chatId: number
}
