import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS設定を追加
    app.enableCors({
    // 許可するオリジン（フロントエンドのURL）を指定します。
    // あなたの環境では 'http://localhost:5173' です。
    origin: 'http://localhost:5173', 
    
    // 許可するHTTPメソッド
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    
    // 認証情報（Cookieなど）の送信を許可する場合
    credentials: true,
  });
  app.enableCors({
    origin: 'http://localhost:5173', // Reactアプリケーションのオリジン
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001); // ポートを3001などに設定
}
bootstrap();
