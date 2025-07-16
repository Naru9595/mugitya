import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User, UserRole, SafeUser } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDTO): Promise<SafeUser> {
    return this.usersService.create(createUserDto);
  }

  /**
   * 全ユーザーの一覧を取得する（管理者限定）
   */
  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  // ★ 返り値の型を SafeUser[] に修正
  findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }
  
  /**
   * 自分自身の情報を取得
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  // ★ 返り値の型を SafeUser に修正
  getProfile(@GetUser() user: User): Promise<SafeUser> {
    return this.usersService.findOne(user.id);
  }

  /**
   * 特定のユーザー情報を取得する（管理者限定）
   * このメソッドは前回のやり取りで抜けていたかもしれませんので、追加します。
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  // ★ 返り値の型を SafeUser に修正
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.usersService.findOne(id);
  }

  /**
   * 特定のユーザー情報を更新する
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  // ★ 返り値の型を SafeUser に修正
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
    @GetUser() requester: SafeUser, // ★ この引数の型もSafeUserに
  ): Promise<SafeUser> {
    return this.usersService.update(id, updateUserDto, requester);
  }

  /**
   * 特定のユーザーを削除する（管理者限定）
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}