import { Injectable } from '@nestjs/common';
import { SpecialFacilityRepository } from './special-facility.repository';
import { SpecialCourseRepository } from '../course/special-course.repository';

@Injectable()
export class SpecialFacilityService {
  constructor(
    private specialFacilityRepository: SpecialFacilityRepository,
    private specialCourseRepository: SpecialCourseRepository,
  ) {}

  async getManyByLocalCode(localCode: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByLocalCode(localCode);

    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyByLocalCodeAndItemName(localCode: string, itemName: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByLocalCodeAndItemName(
        localCode,
        itemName,
      );

    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyByFacilityName(facilityName: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByFacilityName(facilityName);
    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyPopularByLocalCode(localCode: string) {
    return await this.specialFacilityRepository.findManyPopularByLocalCode(
      localCode,
    );
  }

  async getManyPopularByLocalCodeAndType(localCode: string, type: string) {
    return await this.specialFacilityRepository.findManyPopularByLocalCodeAndType(
      localCode,
      type,
    );
  }

  async getDetail(businessId: string) {
    const [facility, courses] = await Promise.all([
      this.specialFacilityRepository.findOne(businessId),
      this.specialCourseRepository.findManyByFacility(businessId),
    ]);

    const items = new Set(courses.map((course) => course.itemName));

    return {
      ...facility,
      items: Array.from(items),
      courses: courses.map((course) => {
        return {
          courseId: course.courseId,
          courseName: course.courseName,
          itemName: course.itemName,
          startTime: course.startTime,
          endTime: course.endTime,
          workday: course.workday,
          price: course.price,
        };
      }),
    };
  }

  async getManyByLocalCodeAndType(localCode: string, type: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByLocalCodeAndType(
        localCode,
        type,
      );

    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyByLocalCodeAndItemNameAndType(
    localCode: string,
    itemName: string,
    type: string,
  ) {
    const facilities =
      await this.specialFacilityRepository.findManyByLocalCodeAndItemNameAndType(
        localCode,
        itemName,
        type,
      );

    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }
}
