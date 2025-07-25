import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../users/dto/create-user.dto'; 
import { User } from '../users/entities/user.entity'; 

@Injectable()
export class AuthService {
  /**
   * コンストラクタで他のサービスを注入（DI）
   * @param usersService - ユーザーのデータアクセスを担当
   * @param jwtService - JWTの生成と検証を担当
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 新規ユーザー登録を行うメソッド
   * @param createUserDto - 登録に必要な情報（email, passwordなど）
   * @returns 作成されたユーザー情報（パスワードハッシュは除く）
   */
  async register(createUserDto: CreateUserDTO): Promise<Omit<User, 'password_hash'>> {
    // UsersServiceを使ってユーザーをデータベースに保存
    // パスワードハッシュ化はUsersService内で行われる
    return this.usersService.create(createUserDto);
  }

  /**
   * ユーザーの認証情報を検証するメソッド (LocalStrategyから使用される)
   * @param email - ユーザーが入力したメールアドレス
   * @param pass - ユーザーが入力した平文のパスワード
   * @returns 認証成功時はユーザー情報、失敗時はnull
   */
  async validateUser(email: string, pass: string): Promise<Omit<User, 'password_hash'> | null> {
    // メールアドレスを元にユーザーを検索
    const user = await this.usersService.findByEmail(email);

    // ユーザーが存在し、かつパスワードが正しいかチェック
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result; // 成功。パスワードハッシュを除いた情報を返す
    }
    return null; // 失敗
  }

  /**
   * ログイン処理を行い、アクセストークンを生成するメソッド
   * @param user - validateUserで認証済みのユーザーオブジェクト
   * @returns アクセストークンを含むオブジェクト
   */
  async login(user: Omit<User, 'password_hash'>) {
    // JWTに含めるペイロード情報
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}