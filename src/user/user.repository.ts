import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser({
    kakaoId,
    email,
    nickname,
  }: {
    kakaoId: string;
    email: string;
    nickname: string;
  }) {
    return this.prisma.user.create({
      data: {
        id: kakaoId,
        email,
        nickname,
      },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return;
  }
}
