import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; 
import { Roles } from '../auth/decorators/roles.decorator'; 
import { UserRole } from '../users/entities/user.entity'; 
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

  @Get('my-orders') 
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Req() req: AuthenticatedRequest) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Delete(':id') 
  @UseGuards(JwtAuthGuard)
  removeMyOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.removeMyOrder(id, req.user.id);
  }



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
  @Get('analytics') 
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getSalesAnalytics() {
    return this.ordersService.getSalesAnalytics();
  }
}
