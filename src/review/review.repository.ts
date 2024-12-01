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

  async findManySpecial(businessId: string) {
    return await this.prisma.review.findMany({
      where: { businessId, serialNumber: null },
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

  async findManyNormalByUserId(userId: string) {
    return (await this.prisma.$queryRaw`
      select
        r.id,
        r."businessId",
        r."serialNumber",
        r.score,
        r.content,
        r."createdAt",
        f.name as "facilityName",
        u.nickname as "nickname"
      from "Review" r
      join "Facility" f
        on r."businessId" = f."businessId" and r."serialNumber" = f."serialNumber"
      join "User" u
        on r."userId" = u.id
      where r."userId" = ${userId}
    `) as {
      id: string;
      businessId: string;
      serialNumber: string;
      score: number;
      content: string;
      createdAt: Date;
      facilityName: string;
      nickname: string;
    }[];
  }

  async findManySpecialByUserId(userId: string) {
    return (await this.prisma.$queryRaw`
      select
        r.id,
        r."businessId",
        r."serialNumber",
        r.score,
        r.content,
        r."createdAt",
        f.name as "facilityName",
        u.nickname as "nickname"
      from "Review" r
      join "Facility" f
        on r."businessId" = f."businessId"
      join "User" u
        on r."userId" = u.id
      where r."userId" = ${userId} and r."serialNumber" is null
    `) as {
      id: string;
      businessId: string;
      serialNumber: null;
      score: number;
      content: string;
      createdAt: Date;
      facilityName: string;
      nickname: string;
    }[];
  }

  async deleteOne(userId: string, reviewId: string) {
    await this.prisma.review.deleteMany({
      where: { id: reviewId, userId },
    });
    return;
  }

  async updateOne(input: UpdateInput) {
    await this.prisma.review.update({
      where: { id: input.reviewId, userId: input.userId },
      data: {
        score: input.score,
        content: input.content,
      },
    });
    return;
  }
}

export type CreateInput = {
  userId: string;
  businessId: string;
  serialNumber?: string;
  score: number;
  content: string;
};

export type UpdateInput = {
  userId: string;
  reviewId: string;
  score: number;
  content: string;
};
