import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoundEntity } from "./entities/round.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RoundEntity])],
  controllers: [RoundController],
  providers: [RoundService]
})
export class RoundModule {}
