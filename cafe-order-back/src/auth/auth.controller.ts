import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * ログインエンドポイント
   * POST /auth/login
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: AuthenticatedRequest, // ★ 型付けされたリクエストオブジェクトを受け取る
    @Body() loginDto: LoginDTO,       // ★ バリデーションが適用されるDTO
  ): Promise<{ access_token: string }> {
    // LocalAuthGuardが認証に成功すると、req.userに検証済みのユーザー情報がセットされます。
    // このユーザー情報を使って、AuthServiceがJWT（アクセストークン）を生成します。
    return this.authService.login(req.user);
  }
}