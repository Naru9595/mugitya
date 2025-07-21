// src/orders/orders.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto'; // ★ インポート
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // ★ インポート
import { Roles } from '../auth/decorators/roles.decorator'; // ★ インポート
import { UserRole } from '../users/entities/user.entity'; // ★ インポート
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- ユーザー向けAPI ---
  @Post()
  @UseGuards(JwtAuthGuard) // ログイン必須
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    return this.ordersService.create(createOrderDto, user);
  }
  // ★★★ ここから機能追加 (ユーザー向けAPI) ★★★

  @Get('my-orders') // /orders/my-orders というパス
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Req() req: AuthenticatedRequest) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Delete(':id') // DELETE /orders/:id
  @UseGuards(JwtAuthGuard)
  removeMyOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.removeMyOrder(id, req.user.id);
  }


  // ★★★ ここから機能追加 (管理者向けAPI) ★★★

  @Get()
  @Roles(UserRole.ADMIN) // ADMINロールを持つユーザーのみアクセス可能
  @UseGuards(JwtAuthGuard, RolesGuard) // ログインチェックとロールチェック
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN) // ADMINロールを持つユーザーのみアクセス可能
  @UseGuards(JwtAuthGuard, RolesGuard) // ログインチェックとロールチェック
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
  @Get('analytics') // GET /orders/analytics
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getSalesAnalytics() {
    return this.ordersService.getSalesAnalytics();
  }
}
