
import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { User } from './user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Post()
  create(@Body(ValidationPipe) user: User) {
    return this.usersService.create(user);
  }

}

