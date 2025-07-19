// src/auth/guards/jwt-auth.guard.ts の最終診断コード

import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Loggerをインスタンス化して、コンソールに分かりやすいログを出力します
  private readonly logger = new Logger(JwtAuthGuard.name);

  /**
   * このメソッドは、ルートがアクセス可能かどうかを判断します。
   * ここで super.canActivate(context) を呼び出すと、Passportの認証フローが開始されます。
   */
  canActivate(context: ExecutionContext) {
    this.logger.log('--- [GUARD START] JwtAuthGuardの認証が開始されました ---');
    
    // リクエストからAuthorizationヘッダーを取得してログに出力します
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    this.logger.debug(`- 受信したAuthorizationヘッダー: ${authHeader}`);

    if (!authHeader) {
      this.logger.warn('- 警告: Authorizationヘッダーが見つかりませんでした。');
    }
    
    this.logger.log('- Passportの認証戦略(JwtStrategy)を呼び出します...');
    // super.canActivate(context) が JwtStrategy をトリガーします。
    // この呼び出しの結果、内部的に handleRequest が呼ばれます。
    return super.canActivate(context);
  }

  /**
   * このメソッドは、Passportの認証戦略が完了した後に呼び出されます。
   * エラー情報(info)やユーザー情報をここで受け取り、最終的な処理を決定します。
   * これまでの401エラーの原因は、このメソッド内で例外がスローされていたためです。
   */
  handleRequest(err, user, info) {
    this.logger.log('--- [GUARD HANDLE] Passportの認証戦略が完了しました ---');
    this.logger.debug(`- 受け取ったエラー情報 (err): ${err}`);
    this.logger.debug(`- 受け取ったユーザー情報 (user): ${JSON.stringify(user)}`);
    this.logger.debug(`- 受け取った追加情報 (info): ${info}`);
    
    // passport-jwtが返す典型的なエラーメッセージをログに出力します
    if (info) {
        this.logger.error(`- 認証失敗の理由: ${info.message}`);
    }

    // ユーザーが見つからない、または何らかのエラーが発生した場合
    if (err || !user) {
      this.logger.error('--- [GUARD FAILED] 認証に失敗しました。401 Unauthorizedを返します。---');
      // ここで最終的に401エラーがスローされます
      throw err || new UnauthorizedException('認証トークンが無効です。');
    }

    // 認証が成功した場合
    this.logger.log('--- [GUARD SUCCESS] 認証に成功しました。ユーザー情報を返します。 ---');
    return user;
  }
}
