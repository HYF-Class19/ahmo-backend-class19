import { Module } from '@nestjs/common';
import { GamerService } from './gamer.service';
import { GamerController } from './gamer.controller';

@Module({
  controllers: [GamerController],
  providers: [GamerService]
})
export class GamerModule {}
