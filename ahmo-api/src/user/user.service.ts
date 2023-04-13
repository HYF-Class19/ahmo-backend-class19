import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save({ ...dto });
  }

  findAll(name: string, userId: number) {
    return this.repository
      .createQueryBuilder('user')
      .where('user.fullName LIKE :name', { name: `%${name}%` })
      .andWhere('user.id != :userId', { userId })
      .getMany();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, updateUserDto);
  }

  async updatePasswd(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findOne({ where: { id } });
    if (updateUserDto.oldPassword === user.password) {
      return this.repository.update(id, {
        password: updateUserDto.newPassword,
      });
    } else {
      throw new ForbiddenException('The old password provided is wrong');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne({ where: { ...cond } });
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  search(name: string) {
    return this.repository.createQueryBuilder('user').getMany();
  }
}
