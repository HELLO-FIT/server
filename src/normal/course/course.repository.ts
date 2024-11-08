import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByFacility(businessId: string, serialNumber: string) {
    return await this.prisma.course.findMany({
      where: {
        businessId,
        facilitySerialNumber: serialNumber,
      },
    });
  }
}
