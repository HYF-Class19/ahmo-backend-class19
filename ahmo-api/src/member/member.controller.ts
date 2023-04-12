import { Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly MemberService: MemberService) {}

  @Get()
  getAll() {
    return this.MemberService.getAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MemberService.remove(+id)
  }
}
