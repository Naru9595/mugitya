import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 'jwt'という名前は、後で作成するjwt.strategy.tsで定義した戦略の名前と一致させます。
  // このガードが適用されると、自動的にJWTの検証が行われ、
  // 成功すればリクエストオブジェクト(req)にユーザー情報(user)が添付されます。
}