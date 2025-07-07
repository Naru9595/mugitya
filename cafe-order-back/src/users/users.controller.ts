import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, User } from './entities/user.entity';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * (公開) 新規ユーザー登録
   */
  @Post()
  // ★修正1: 返り値の型をサービスと一致させる
  async create(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.usersService.create(createUserDto);
  }

  /**
   * (管理者のみ) 全ユーザーの一覧を取得
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * (ログインユーザー自身) 自分の情報を取得
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@Req() req: AuthenticatedRequest): Promise<User> {
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }

  /**
   * (管理者のみ) IDを指定して特定のユーザー情報を取得
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * (ログインユーザー自身 or 管理者) ユーザー情報を更新
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    const requester = req.user;
    // サービスにrequesterを渡す（サービス側の修正が必要）
    return this.usersService.update(id, updateUserDto, requester);
  }

  /**
   * (管理者のみ) ユーザーを削除
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  // ★修正3: 返り値の型をサービスと一致させる
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
