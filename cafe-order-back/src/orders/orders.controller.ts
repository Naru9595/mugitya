import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // ★ ログイン必須
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedRequest, // ★ ガードによって追加されたユーザー情報を取得
  ) {
    const user = req.user;
    return this.ordersService.create(createOrderDto, user);
  }

  // ... 他のエンドポイント
}
