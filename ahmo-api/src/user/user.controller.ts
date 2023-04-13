import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req, @Query('query') query?: string) {
    return this.userService.findAll(query, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @Query('passwd') passwd: string,
  ) {
    console.log(passwd);
    console.log(updateUserDto);
    if (passwd) {
      return this.userService.updatePasswd(+req.user.id, updateUserDto);
    }
    return this.userService.update(+req.user.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('search')
  search(@Query('query') query?: string) {
    return this.userService.search(query);
  }
}
