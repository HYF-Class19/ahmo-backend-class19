import {IsNumber, IsString} from "class-validator";

export class CreateMoveDto {
    @IsString()
    move_data: string;

    @IsString()
    move_type: string;

    @IsNumber()
    roundId: number;
}

