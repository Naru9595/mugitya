import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    // 許可するオリジン（フロントエンドのURL）
    origin: 'http://localhost:5173', 
    
    // 許可するHTTPメソッド
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    
    allowedHeaders: 'Content-Type, Authorization',

    // 認証情報（Cookieなど）の送信を許可する場合
    credentials: true,
  });

  // グローバルなバリデーションパイプを設定
  app.useGlobalPipes(new ValidationPipe());

  // アプリケーションをポート3000で起動
  await app.listen(3000);
}
bootstrap();
