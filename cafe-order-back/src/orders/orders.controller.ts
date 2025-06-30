// src/orders/orders.controller.ts
import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard) // このコントローラーのAPIは全てログイン必須にする
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 【ユーザー向け】注文を作成
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  // 【ユーザー向け】自分の注文履歴を取得
  @Get('my')
  findMyOrders(@GetUser() user: User) {
    return this.ordersService.findMyOrders(user);
  }

  // --- 管理者向けAPI ---
  
  // 【管理者向け】全ての注文を取得
  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.ordersService.findAll();
  }
  
  // 【管理者向け】注文ステータスを更新
  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderDto);
  }
}