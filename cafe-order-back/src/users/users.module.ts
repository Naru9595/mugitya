import { Module } from '@nestjs/common'; // ★ forwardRef のインポートを削除
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
// import { AuthModule } from '../auth/auth.module'; // ★ この行を削除します

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // forwardRef(() => AuthModule), // ★ この行を削除します
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
