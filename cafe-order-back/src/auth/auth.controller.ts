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
   * @param req - リクエストオブジェクト
   * @param loginDto - リクエストボディ (実際にはGuardが使用)
   */
  @UseGuards(LocalAuthGuard) // Passportの'local'戦略を呼び出すガード
  @Post('login')
  async login(
    @Req() req: AuthenticatedRequest,
    @Body() loginDto: LoginDTO, // DTOはバリデーションとドキュメンテーションのために記述
  ): Promise<{ access_token: string }> {
    // LocalAuthGuardが認証に成功すると、req.userに検証済みのユーザー情報がセットされます。
    // このユーザー情報を使って、AuthServiceがJWT（アクセストークン）を生成します。
    return this.authService.login(req.user);
  }
}
