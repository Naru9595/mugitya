import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // この一行だけで、Passportの 'local' 戦略を呼び出すガードが完成します。
  // 'local' 戦略は、ユーザー名とパスワードの検証を担当します。
}