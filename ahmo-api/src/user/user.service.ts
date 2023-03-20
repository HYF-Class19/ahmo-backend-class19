import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from "./dto/login-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {
  }

  create(dto: CreateUserDto) {
    return this.repository.save({...dto});
  }

  findAll(name: string) {
   return this.repository.createQueryBuilder('user').where('user.fullName LIKE :name', {name: `%${name}%`}).getMany()
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne({ where: { ...cond } });
  }

  findById(id) {
    return this.repository.findOne({ where: { id } });
  }
}
