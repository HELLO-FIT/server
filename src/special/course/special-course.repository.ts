import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpecialCourseRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByFacility(businessId: string) {
    return await this.prisma.specialCourse.findMany({
      where: {
        businessId,
      },
    });
  }
}
