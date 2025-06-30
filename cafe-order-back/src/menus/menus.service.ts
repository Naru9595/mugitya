// src/menus/menus.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // 【管理者向け】新しいメニューを作成
  create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  // 【ユーザー・管理者共通】全メニューを取得
  findAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  // 【ユーザー・管理者共通】IDで特定のメニューを取得
  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`ID ${id} のメニューが見つかりません。`);
    }
    return menu;
  }

  // 【管理者向け】メニュー情報を更新
  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepository.preload({
      id,
      ...updateMenuDto,
    });
    if (!menu) {
      throw new NotFoundException(`ID ${id} のメニューが見つかりません。`);
    }
    return this.menuRepository.save(menu);
  }

  // 【管理者向け】メニューを削除
  async remove(id: number): Promise<Menu> {
    const menu = await this.findOne(id);
    return this.menuRepository.remove(menu);
  }
}