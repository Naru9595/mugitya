// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // ★ TypeOrmModuleをインポート
import { User } from './entities/user.entity';     // ★ Userエンティティをインポート

@Module({
  // ★★★ この imports 配列を追加または編集します ★★★
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // ★ UsersServiceを他のモジュールで使えるようにexportsを追加
  exports: [UsersService],
})
export class UsersModule {}