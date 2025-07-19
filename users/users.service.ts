import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { name: username } });
  }
}