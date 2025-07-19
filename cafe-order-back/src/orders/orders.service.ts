import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Menu } from '../menus/entities/menu.entity';
import { User } from '../users/entities/user.entity'; // ★ 正しいUserエンティティをインポート
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Menu)
    private readonly menusRepository: Repository<Menu>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { menuIds } = createOrderDto;

    if (menuIds.length === 0) {
      throw new BadRequestException('注文するメニューが選択されていません。');
    }

    // 1. 注文されたメニューの一意なIDリストを取得し、DBから情報を取得
    const uniqueMenuIds = [...new Set(menuIds)];
    const menus = await this.menusRepository.findBy({ id: In(uniqueMenuIds) });

    // 2. 在庫チェックと合計金額の計算
    let totalPrice = 0;
    for (const id of menuIds) {
      const menu = menus.find(m => m.id === id);
      if (!menu) {
        throw new NotFoundException(`ID ${id} のメニューが見つかりません。`);
      }
      
      // ★ 在庫チェックを追加
      if (menu.stock <= 0) {
        throw new BadRequestException(`${menu.name}は品切れです。`);
      }
      
      totalPrice += menu.price;
    }

    // 3. 注文エンティティを作成
    const newOrder = this.ordersRepository.create({
      user, // ★ 完全なuserオブジェクトを渡す
      menus,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    // 4. 在庫を削減
    // 本番環境ではトランザクション処理が必須です
    for (const menu of menus) {
        const orderCount = menuIds.filter(id => id === menu.id).length;
        menu.stock -= orderCount;
    }
    await this.menusRepository.save(menus);


    // 5. 注文をDBに保存
    return this.ordersRepository.save(newOrder);
  }

  // ... 他のメソッド（注文履歴取得など）
}
