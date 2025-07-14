// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // もし使っていればインポート

async function bootstrap() {
  // 1. Nestアプリケーションのインスタンスを作成し、'app'という名前の変数に格納
  const app = await NestFactory.create(AppModule);

  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  // 2. 'app'が作成された後で、CORSの設定を行う（★ここに追加します★）
  app.enableCors({
    origin: 'http://localhost:5173', // あなたのフロントエンドのURL
    credentials: true,
  });
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  
  // バリデーションパイプなど、他のグローバルな設定もこの辺りに書きます
  app.useGlobalPipes(new ValidationPipe());

  // 3. 最後に、全ての設定が完了したアプリを起動する
  await app.listen(3000);
}
bootstrap();