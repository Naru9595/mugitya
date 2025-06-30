// src/menus/menus.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
  ) {}

  // 新しいメニューを作成
  create(createMenuDto: CreateMenuDto) {
    const newMenu = this.menusRepository.create(createMenuDto);
    return this.menusRepository.save(newMenu);
  }

  // 全てのメニューを取得
  findAll() {
    return this.menusRepository.find();
  }

  // IDで特定のメニューを取得
  findOne(id: number) {
    return this.menusRepository.findOneBy({ id });
  }

  // IDで特定のメニューを削除
  async remove(id: number) {
    // まずは存在確認（任意ですが丁寧）
    const menu = await this.findOne(id);
    if (!menu) {
      return null; // or throw an error
    }
    return this.menusRepository.remove(menu);
  }
}