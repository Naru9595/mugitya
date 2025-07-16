// src/menus/menus.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeOrmModuleをインポート
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';

import { Menu } from './entities/menu.entity'; // Menuエンティティをインポート

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]), // ★この行を追加
  ],


  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService], // 他のモジュールで使う可能性があればエクスポート
})
export class MenusModule {}