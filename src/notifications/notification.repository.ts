import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    userId,
    businessId,
    serialNumber,
    facilityName,
    courseNames,
  }: CreateInput) {
    await this.prisma.notification.create({
      data: {
        userId,
        businessId,
        serialNumber,
        facilityName,
        courseNames,
      },
    });
  }

  async findOneByBusinessIdAndSerialNumber(
    userId: string,
    businessId: string,
    serialNumber: string,
  ) {
    return this.prisma.notification.findFirst({
      where: {
        userId,
        businessId,
        serialNumber,
      },
    });
  }

  async findOneByBusinessId(userId: string, businessId: string) {
    return this.prisma.notification.findFirst({
      where: {
        userId,
        businessId,
        serialNumber: null,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}

export type CreateInput = {
  userId: string;
  businessId: string;
  serialNumber: string | null;
  facilityName: string;
  courseNames: string[];
};
