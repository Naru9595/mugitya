import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, SafeUser } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // --- Private Helper Method ---
  private toSafeUser(user: User): SafeUser {
    const { password_hash, ...result } = user;
    return result;
  }

  // --- Public Methods (create, findAll, findOne, findByEmailは変更なし) ---

  async create(createUserDto: CreateUserDTO): Promise<SafeUser> {
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password_hash,
      role: UserRole.CUSTOMER,
    });
    
    const savedUser = await this.usersRepository.save(newUser);
    
    return this.toSafeUser(savedUser);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map(user => this.toSafeUser(user));
  }

  async findOne(id: number): Promise<User> { 
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }
    return user; // toSafeUserで変換せず、そのままuserオブジェクトを返す
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

    async update(
    id: number,
    updateUserDto: UpdateUserDTO,
    requester: SafeUser,
  ): Promise<SafeUser> {
    // --- 権限チェック ---
    // リクエストを実行したユーザーがADMINロールを持っているかを確認します。
    if (requester.role !== UserRole.ADMIN) {
      // ADMINでない場合は、権限がないためエラーをスローします。
      throw new ForbiddenException('この操作を実行する権限がありません。管理者のみがユーザー情報を更新できます。');
    }
    // ---

    const userToUpdate = await this.usersRepository.findOneBy({ id });
    if (!userToUpdate) {
        throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }

    // DTOのプロパティを更新対象のエンティティにマージします
    Object.assign(userToUpdate, updateUserDto);

    // パスワードがDTOに含まれている場合は、ハッシュ化して更新します
    if (updateUserDto.password) {
      userToUpdate.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepository.save(userToUpdate);
    return this.toSafeUser(updatedUser);
  }
  async remove(id: number): Promise<{ message: string }> {
    const userToRemove = await this.usersRepository.findOneBy({ id });
    if (!userToRemove) {
        throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }
    await this.usersRepository.remove(userToRemove);
    return { message: `ID "${id}" のユーザーを削除しました` };
  }

  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return false;
    }
    return user.role === UserRole.ADMIN;
  }
}
