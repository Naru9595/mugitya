import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // BearerトークンからJWTを抽出
      ignoreExpiration: false, // トークンの有効期限をチェックする
      secretOrKey: 'KIMITO_SICK', // auth.module.tsと同じ秘密鍵を使用
    });
  }

  async validate(payload: any) {
    // payloadにはJWTに埋め込んだ情報（email, sub (userId), role）が含まれる
    // auth.service.tsのloginメソッドで設定したペイロードと一致させる
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}