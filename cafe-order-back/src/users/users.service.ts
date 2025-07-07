import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException, // ForbiddenExceptionをインポート
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<Omit<User, 'password_hash'>> {
    const { email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      email,
      password_hash,
      role: UserRole.CUSTOMER,
    });
    
    const savedUser = await this.usersRepository.save(newUser);
    
    const { password_hash: _, ...result } = savedUser;
    return result;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }
    return user;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  // ★修正2: updateメソッドのシグネチャとロジックを修正
  async update(
    id: number,
    updateUserDto: UpdateUserDTO,
    requester: User, // requesterを引数として受け取る
  ): Promise<User> {
    // --- 権限チェック ---
    const isRequesterAdmin = requester.role === UserRole.ADMIN;
    const isUpdatingSelf = requester.id === id;

    if (!isRequesterAdmin && !isUpdatingSelf) {
      throw new ForbiddenException('このユーザー情報を更新する権限がありません。');
    }
    // --- 権限チェックここまで ---

    const userToUpdate = await this.findOne(id);

    // emailの更新（もしあれば）
    if (updateUserDto.email) {
      // 必要であれば、ここでもemailの重複チェックを追加する
      userToUpdate.email = updateUserDto.email;
    }
    
    // パスワードの更新（もしあれば）
    if (updateUserDto.password) {
      const saltRounds = 10;
      userToUpdate.password_hash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
    // roleの更新（管理者のみ可能）
    if (updateUserDto.role && isRequesterAdmin) {
        userToUpdate.role = updateUserDto.role;
    } else if (updateUserDto.role && !isRequesterAdmin) {
        throw new ForbiddenException('ロールの変更は管理者のみ可能です。');
    }

    return this.usersRepository.save(userToUpdate);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: `ID "${id}" のユーザーを削除しました` };
  }

  // ロール確認メソッドは変更なし
  async checkUserRole(userId: number, role: UserRole): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === role;
  }

  async isAdmin(userId: number): Promise<boolean> {
    return this.checkUserRole(userId, UserRole.ADMIN);
  }
}
