import { Module } from '@nestjs/common';
import { MoveService } from './move.service';
import { MoveController } from './move.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MoveEntity } from "./entities/move.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MoveEntity])],
  controllers: [MoveController],
  providers: [MoveService]
})
export class MoveModule {}
