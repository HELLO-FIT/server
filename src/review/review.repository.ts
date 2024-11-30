import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private prisma: PrismaService) {}

  async create(createinput: CreateInput) {
    return await this.prisma.review.create({
      data: createinput,
    });
  }

  async findOne({
    userId,
    businessId,
    serialNumber,
  }: {
    userId: string;
    businessId: string;
    serialNumber?: string;
  }) {
    if (serialNumber) {
      return await this.prisma.review.findFirst({
        where: { userId, businessId, serialNumber },
      });
    } else {
      return await this.prisma.review.findFirst({
        where: {
          userId,
          businessId,
          serialNumber: null,
        },
      });
    }
  }

  async findManyNormal(businessId: string, serialNumber: string) {
    return await this.prisma.review.findMany({
      where: { businessId, serialNumber },
      select: {
        id: true,
        userId: true,
        score: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export type CreateInput = {
  userId: string;
  businessId: string;
  serialNumber?: string;
  score: number;
  content: string;
};
