import { PartialType } from '@nestjs/mapped-types';
import { CreateGamerDto } from './create-gamer.dto';

export class UpdateGamerDto extends PartialType(CreateGamerDto) {}
