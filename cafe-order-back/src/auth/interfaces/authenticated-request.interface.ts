import { Request } from 'express';
import { SafeUser, User } from '../../users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User; // Requestオブジェクトにuserプロパティが存在することを型定義
}