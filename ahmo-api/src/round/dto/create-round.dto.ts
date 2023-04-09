import {IsNumber, IsOptional, IsString} from "class-validator";

export class CreateRoundDto {
    @IsNumber()
    riddlerId: number;

    @IsNumber()
    chatId: number
    
    @IsOptional()
    @IsNumber()
    submiting: number
}
