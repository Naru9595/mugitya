// src/users/users.service.ts

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

  // --- Private Helper Method (mainブランチの安全な実装を採用) ---
  private toSafeUser(user: User): SafeUser {
    const { password_hash, ...result } = user;
    return result;
  }

  // --- Public Methods ---

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

  async findOne(id: number): Promise<SafeUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }
    return this.toSafeUser(user);
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDTO,
    requester: SafeUser, // mainブランチの安全な型定義を採用
  ): Promise<SafeUser> {
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    if (!userToUpdate) {
        throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }

    // --- 権限チェック (両方のブランチで共通する良いロジック) ---
    const isRequesterAdmin = requester.role === UserRole.ADMIN;
    const isUpdatingSelf = requester.id === id;
    if (!isRequesterAdmin && !isUpdatingSelf) {
      throw new ForbiddenException('このユーザー情報を更新する権限がありません。');
    }
    // ---

    // mainブランチの簡潔な更新方法を採用
    Object.assign(userToUpdate, updateUserDto);

    if (updateUserDto.password) {
      userToUpdate.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    if (updateUserDto.role && !isRequesterAdmin) {
        throw new ForbiddenException('ロールの変更は管理者のみ可能です。');
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