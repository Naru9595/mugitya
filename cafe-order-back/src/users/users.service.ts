import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
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

  // --- ★★★ここを修正します★★★ ---
  async create(createUserDto: CreateUserDTO): Promise<Omit<User, 'password_hash'>> {
    const { email, password } = createUserDto;

    // メールアドレスの重複チェック
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    // パスワードをハッシュ化
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // ★修正: ...createUserDto を使わず、プロパティを明示的にマッピングします。
    // これにより、DTOの'password'プロパティがEntityに紛れ込むのを防ぎます。
    const newUser = this.usersRepository.create({
      email: email,
      password_hash: password_hash,
      role: UserRole.CUSTOMER, // デフォルトロールを設定
    });

    // ユーザーをデータベースに保存
    const savedUser = await this.usersRepository.save(newUser);
    
    // パスワードハッシュをレスポンスから除外して返す
    const { password_hash: _, ...result } = savedUser;
    return result;
  }
  
  // --- 他メソッドは変更なし ---
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

  async update(
    id: number,
    updateUserDto: UpdateUserDTO,
    requester: User,
  ): Promise<User> {
    const isRequesterAdmin = requester.role === UserRole.ADMIN;
    const isUpdatingSelf = requester.id === id;

    if (!isRequesterAdmin && !isUpdatingSelf) {
      throw new ForbiddenException('このユーザー情報を更新する権限がありません。');
    }
    
    const userToUpdate = await this.findOne(id);

    if (updateUserDto.email) {
      userToUpdate.email = updateUserDto.email;
    }
    
    if (updateUserDto.password) {
      const saltRounds = 10;
      userToUpdate.password_hash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
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

  async checkUserRole(userId: number, role: UserRole): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === role;
  }

  async isAdmin(userId: number): Promise<boolean> {
    return this.checkUserRole(userId, UserRole.ADMIN);
  }
}
