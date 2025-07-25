export class UserResponseDTO {
  id: number; // 通番IDはnumber型と仮定

  email: string;

  role: string; // UserRole型でも可

  createdAt: Date; // 作成日時

  updatedAt: Date; // 更新日時

  // パスワードは絶対に含めない！
}