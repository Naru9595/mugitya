import {Controller,Get,Post,Body,Patch,
Param,Delete,UseGuards,Req,ParseIntPipe,
ClassSerializerInterceptor,UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//import { RolesGuard } from '../auth/guards/roles.guard';
//import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
//import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
//実装でき次第コメントアウト解除*

@Controller('users')
// @UseInterceptors(ClassSerializerInterceptor) // Userエンティティの@Exclude()を有効にする簡単な方法
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * (公開) 新規ユーザー登録
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    // パスワードハッシュはサービス層で処理される
    // ★注意: 本来は UserResponseDTO に変換して返すのが最も安全
    return this.usersService.create(createUserDto);
  }

  /**
   * (管理者のみ) 全ユーザーの一覧を取得
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // 管理者と店員がアクセス可能
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  
  /**
   * (ログインユーザー自身) 自分の情報を取得
   */
  @Get('me')
  @UseGuards(JwtAuthGuard) // ログインさえしていればOK
  async findMe(@Req() req: AuthenticatedRequest): Promise<User> {
    // Guardによって req.user には認証済みユーザー情報が格納されている
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }

  /**
   * (管理者・店員のみ) IDを指定して特定のユーザー情報を取得
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    // ParseIntPipe は :id が数値であることを保証する
    return this.usersService.findOne(id);
  }

  /**
   * (ログインユーザー自身 or 管理者) ユーザー情報を更新
   * 権限チェックはサービス層で行う
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    const requester = req.user; // リクエストを行ったユーザー
    return this.usersService.update(id, updateUserDto, requester);
  }

  /**
   * (管理者のみ) ユーザーを削除
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}