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

  create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  findAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`ID ${id} のメニューが見つかりません。`);
    }
    return menu;
  }

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

  async remove(id: number): Promise<Menu> {
    const menu = await this.findOne(id);
    return this.menuRepository.remove(menu);
  }
}