// src/menus/menus.module.ts

import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // ★ TypeOrmModuleをインポート
import { Menu } from './entities/menu.entity';     // ★ Menuエンティティをインポート

@Module({
  // ★★★ この imports 配列を追加または編集します ★★★
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}