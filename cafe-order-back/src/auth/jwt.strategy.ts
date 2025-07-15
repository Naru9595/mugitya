import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './../users/users.service'; // ★ UsersServiceをインポート
import { User } from './../users/entities/user.entity'; // ★ Userエンティティをインポート

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // ★★★ここから修正★★★
    // データベースを検索するためにUsersServiceを注入します
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'KIMITO_SICK', // ご要望の通り、秘密鍵はそのままにします
    });
  }

  /**
   * トークンの署名検証が成功した後に呼び出されるメソッドです。
   * @param payload - JWTのペイロード (例: { sub: userId, email: ... })
   * @returns データベースから取得したユーザーオブジェクト
   */
  async validate(payload: { sub: number; email: string }): Promise<User> {
    // ペイロードのsub（ユーザーID）を元に、データベースから最新のユーザー情報を検索します
    const user = await this.usersService.findOne(payload.sub);
    
    // もしユーザーが存在しなければ、トークンは有効でも認証は失敗させます
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりませんでした。');
    }
    
    // このメソッドが返した完全なUserオブジェクトが、リクエストオブジェクト(req.user)に格納されます
    return user;
  }
  // ★★★ここまで修正★★★
}
