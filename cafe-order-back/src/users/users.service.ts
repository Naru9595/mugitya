import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// (1) @Injectable() デコレータ
@Injectable()
export class UsersService {
  // (2) コンストラクタと依存性の注入 (Dependency Injection)
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // (3) ユーザー作成メソッド (Create)
  async create(createUserDto: CreateUserDTO): Promise<Omit<User, 'password_hash'>> {
    const { email, password } = createUserDto;

    // メールアドレスの重複チェック
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password_hash,
      // デフォルトロールはここで設定してみる
      role: UserRole.CUSTOMER, 
    });
    // ユーザーをデータベースに保存
    const savedUser = await this.usersRepository.save(newUser); //非同期
    
    // パスワードハッシュをレスポンスから除外して返す
    const { password_hash: _, ...result } = savedUser;
    return result;
  }

  // (4) 全ユーザー取得メソッド (Read)
  async findAll(): Promise<User[]> {
    // 【注意】パスワードハッシュを含んでしまうため、実際にはselectでカラムを指定するべき
    return this.usersRepository.find();
  }

  // (5) IDによる単一ユーザー取得メソッド (Read)
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }
    return user;
  }
  
  // (6) メールアドレスによる単一ユーザー取得メソッド (AuthService向け)
  async findByEmail(email: string): Promise<User | null> {
    // findOneByは見つからない場合nullを返すので、例外をスローしない
    return this.usersRepository.findOneBy({ email });
  }

  // (7) ユーザー更新メソッド (Update)
  async update(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    // 既存ユーザーの存在確認
    const existingUser = await this.findOne(id);
    
    // updateUserDtoからpasswordを分離
    const { password, ...otherUpdates } = updateUserDto;
    
    // パスワードが更新される場合はハッシュ化
    let updateData: any = { ...otherUpdates };
    if (password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
    }
    
    // preloadを使用してエンティティを更新
    const user = await this.usersRepository.preload({
      id: id,
      ...updateData,
    });
    
    if (!user) {
      throw new NotFoundException(`ID "${id}" のユーザーは見つかりませんでした`);
    }
    
    return this.usersRepository.save(user);
  }

  // (8) ユーザー削除メソッド (Delete)
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id); // 存在チェック
    await this.usersRepository.remove(user);
    return { message: `ID "${id}" のユーザーを削除しました` };
  }
    // (9) ロール確認メソッド (ここから追記)

  /**
   * 指定されたIDのユーザーが特定のロールを持っているかを確認する汎用メソッド
   * @param userId チェックするユーザーのID
   * @param role 確認したいロール
   * @returns ロールが一致すれば true, そうでなければ false
   */
  async checkUserRole(userId: number, role: UserRole): Promise<boolean> {
    // findOneメソッドを再利用してユーザーを取得
    const user = await this.findOne(userId);
    // ユーザーのロールが指定されたロールと一致するかを返す
    return user.role === role;
  }

  /**
   * 指定されたIDのユーザーが管理者(ADMIN)かどうかをチェックするヘルパーメソッド
   * @param userId チェックするユーザーのID
   * @returns 管理者であれば true, そうでなければ false
   */
  async isAdmin(userId: number): Promise<boolean> {
    return this.checkUserRole(userId, UserRole.ADMIN);
  }

  /**
   * 指定されたIDのユーザーが顧客(CUSTOMER)かどうかをチェックするヘルパーメソッド
   * @param userId チェックするユーザーのID
   * @returns 顧客であれば true, そうでなければ false
   */
  async isCustomer(userId: number): Promise<boolean> {
    return this.checkUserRole(userId, UserRole.CUSTOMER);
  }
}