import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Roles()デコレータで指定された必須ロールを取得
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // そもそもロールが指定されていなければ、アクセスを許可
    if (!requiredRoles) {
      return true;
    }

    // JwtAuthGuardによって追加されたリクエストオブジェクト中のuser情報を取得
    const { user } = context.switchToHttp().getRequest();

    // ユーザーのロールが、必須ロールのいずれかに含まれているかを確認
    return requiredRoles.some((role) => user.role === role); // includes() を === に変更
  }
}