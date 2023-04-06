import {IsNumber, IsOptional, IsString} from "class-validator";

export class CreateMoveDto {
    @IsString()
    move_data: string;

    @IsString()
    move_type: string;

    @IsNumber()
    roundId: number;

    @IsOptional()
    @IsString()
    last_word: string
}

