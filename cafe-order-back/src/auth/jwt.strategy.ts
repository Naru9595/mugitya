import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'; // ★ Loggerをインポートします
import { UsersService } from '../users/users.service';
import { SafeUser, User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // ★ Loggerのインスタンスを作成します。これにより、コンソールに色付きで分かりやすいログが出力されます。
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'KIMITO_SICK', // 診断のため、秘密鍵はハードコードしたままにします
    });
    this.logger.log('JwtStrategy has been initialized.'); // ストラテジーが初期化されたことをログに出力
  }

  /**
   * JWTのペイロードを検証し、リクエストに含めるユーザー情報を返します。
   * このメソッド内でエラーが発生すると401 Unauthorizedが返されます。
   */
  async validate(payload: { sub: number; email: string }): Promise<SafeUser> {
    // --- ここからが診断ログの本番です ---
    this.logger.log(`[VALIDATE START] - 認証プロセスを開始します...`);
    this.logger.debug(`- 受け取ったトークンの内容 (payload): ${JSON.stringify(payload)}`);

    // ペイロードや、その中のユーザーID(sub)が存在しないという万が一のケースをチェック
    if (!payload || !payload.sub) {
      this.logger.error('- トークンの内容が不正か、ユーザーID(sub)が含まれていません。');
      throw new UnauthorizedException('無効なトークンです。');
    }

    try {
      this.logger.debug(`- データベースにユーザーを問い合わせます (ID: ${payload.sub})`);
      // ユーザーIDを使って、データベースからユーザー情報を取得します
      const user: User = await this.usersService.findOne(payload.sub);

      // もしユーザーが見つからなかった場合...
      if (!user) {
        // これがエラーの最有力候補です
        this.logger.error(`- 致命的なエラー: ID ${payload.sub} のユーザーがデータベースに見つかりませんでした。`);
        throw new UnauthorizedException('ユーザーが見つかりません。');
      }

      // ユーザーが見つかった場合
      this.logger.log(`- 成功: ID ${payload.sub} のユーザーが見つかりました。`);
      const { password_hash, ...safeUser } = user;
      
      this.logger.log(`[VALIDATE SUCCESS] - 認証成功。安全なユーザー情報を返します。`);
      return safeUser;

    } catch (error) {
      // usersService.findOneが例外を投げた場合なども含め、すべてここでキャッチします
      this.logger.error(`[VALIDATE FAILED] - 認証プロセス中に予期せぬエラーが発生しました。`, error.stack);
      throw new UnauthorizedException('認証に失敗しました。');
    }
  }
}