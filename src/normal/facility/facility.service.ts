import { Injectable } from '@nestjs/common';
import { FacilityRepository } from './facility.repository';
import { CourseRepository } from '../course/course.repository';

@Injectable()
export class FacilityService {
  constructor(
    private facilityRepository: FacilityRepository,
    private courseRepository: CourseRepository,
  ) {}

  async getManyByLocalCode(localCode: string) {
    const facilities =
      await this.facilityRepository.findManyByLocalCode(localCode);
    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyByLocalCodeAndItemName(localCode: string, itemName: string) {
    const facilities =
      await this.facilityRepository.findManyByLocalCodeAndItemName(
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
      await this.facilityRepository.findManyByFacilityName(facilityName);
    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyPopularByLocalCode(localCode: string) {
    const facilities =
      await this.facilityRepository.findManyPopularByLocalCode(localCode);
    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getDetail({
    businessId,
    serialNumber,
    userId,
  }: {
    businessId: string;
    serialNumber: string;
    userId: string | null;
  }) {
    let facility;
    let courses;
    let favorite = false;

    if (userId) {
      [facility, courses, favorite] = await Promise.all([
        this.facilityRepository.findOne(businessId, serialNumber),
        this.courseRepository.findManyByFacility(businessId, serialNumber),
        this.facilityRepository.isFavorite({
          businessId,
          serialNumber,
          userId,
        }),
      ]);
    } else {
      [facility, courses] = await Promise.all([
        this.facilityRepository.findOne(businessId, serialNumber),
        this.courseRepository.findManyByFacility(businessId, serialNumber),
      ]);
    }

    const items = new Set(courses.map((course) => course.itemName));

    return {
      businessId: facility.businessId,
      serialNumber: facility.serialNumber,
      name: facility.name,
      cityCode: facility.cityCode,
      cityName: facility.cityName,
      localCode: facility.localCode,
      localName: facility.localName,
      address: facility.address,
      detailAddress: facility.detailAddress,
      owner: facility.owner,
      phone: facility.phone,
      items: Array.from(items),
      isFavorite: favorite,
      courses: courses.map((course) => {
        return {
          courseId: course.courseId,
          courseName: course.courseName,
          itemName: course.itemName,
          instructor: course.instructor,
          startTime: course.startTime,
          endTime: course.endTime,
          workday: course.workday,
          price: course.price,
        };
      }),
    };
  }

  async toggleFavorite({
    businessId,
    serialNumber,
    userId,
  }: {
    businessId: string;
    serialNumber: string;
    userId: string;
  }) {
    await this.facilityRepository.toggleFavorite({
      businessId,
      serialNumber,
      userId,
    });
    return;
  }
}
