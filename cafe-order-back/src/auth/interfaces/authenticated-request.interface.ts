import { Request } from 'express';
import { SafeUser } from '../../users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: SafeUser; // Requestオブジェクトにuserプロパティが存在することを型定義
}