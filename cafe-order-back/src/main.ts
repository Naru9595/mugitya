// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ★★★ここが最重要ポイント★★★
  // CORS設定を修正します。
  app.enableCors({
    // 許可するオリジン（フロントエンドのURL）
    origin: 'http://localhost:5173', 
    
    // 許可するHTTPメソッド
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    
    // ★★★この行が追加されました★★★
    // フロントエンドから送信を許可するリクエストヘッダーのリスト。
    // 'Authorization'ヘッダーを許可しないと、ブラウザはトークンを送信してくれません。
    allowedHeaders: 'Content-Type, Authorization',

    // 認証情報（Cookieなど）の送信を許可する場合
    credentials: true,
  });

  // グローバルなバリデーションパイプを設定（重複していたので一つにまとめました）
  app.useGlobalPipes(new ValidationPipe());

  // アプリケーションをポート3000で起動
  await app.listen(3000);
}
bootstrap();
