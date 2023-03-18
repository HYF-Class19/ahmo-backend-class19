import { Controller, Get } from "@nestjs/common";
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly MemberService: MemberService) {}

  @Get()
  getAll() {
    return this.MemberService.getAll();
  }
}
