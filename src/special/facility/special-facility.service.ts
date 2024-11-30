import { Injectable, HttpException } from '@nestjs/common';
import { SpecialFacilityRepository } from './special-facility.repository';
import { SpecialCourseRepository } from '../course/special-course.repository';
import { NotificationRepository } from 'src/notifications/notification.repository';
import { ReviewRepository } from 'src/review/review.repository';

@Injectable()
export class SpecialFacilityService {
  constructor(
    private specialFacilityRepository: SpecialFacilityRepository,
    private specialCourseRepository: SpecialCourseRepository,
    private notificationRepository: NotificationRepository,
    private reviewRepository: ReviewRepository,
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

  async getManyPopular(localCode: string) {
    return await this.specialFacilityRepository.findManyPopular(localCode);
  }

  async getManyPopularByType(localCode: string, type: string) {
    return await this.specialFacilityRepository.findManyPopularByType(
      localCode,
      type,
    );
  }

  async getManyPopularByItemName(localCode: string, itemName: string) {
    return await this.specialFacilityRepository.findManyPopularByItemName(
      localCode,
      itemName,
    );
  }

  async getManyPopularByItemNameAndType({
    localCode,
    itemName,
    type,
  }: {
    localCode: string;
    itemName: string;
    type: string;
  }) {
    return await this.specialFacilityRepository.findManyPopularByItemNameAndType(
      {
        localCode,
        itemName,
        type,
      },
    );
  }

  async getDetail(businessId: string, userId: string | null) {
    let facility;
    let courses;
    let favorite = false;

    if (userId) {
      [facility, courses, favorite] = await Promise.all([
        this.specialFacilityRepository.findOne(businessId),
        this.specialCourseRepository.findManyByFacility(businessId),
        this.specialFacilityRepository.isFavorite(userId, businessId),
      ]);
    } else {
      [facility, courses] = await Promise.all([
        this.specialFacilityRepository.findOne(businessId),
        this.specialCourseRepository.findManyByFacility(businessId),
      ]);
    }

    const items = new Set(courses.map((course) => course.itemName));
    const types = new Set(courses.map((course) => course.type));

    return {
      ...facility,
      items: Array.from(items),
      types: Array.from(types),
      isFavorite: favorite,
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

  async toggleFavorite(userId: string, businessId: string) {
    const result = await this.specialFacilityRepository.toggleFavorite(
      userId,
      businessId,
    );

    if (result) {
      const [facility, courses] = await Promise.all([
        this.specialFacilityRepository.findOne(businessId),
        this.specialCourseRepository.findManyByFacility(businessId),
      ]);

      const notification =
        await this.notificationRepository.findOneByBusinessId(
          userId,
          businessId,
        );

      if (notification) {
        await this.notificationRepository.delete(notification.id);
      }

      await this.notificationRepository.create({
        userId,
        businessId,
        serialNumber: null,
        facilityName: facility.name,
        courseNames: courses.map((course) => course.courseName),
      });
    }

    return;
  }

  async createReview(input: CreateReviewInput) {
    const { userId, businessId, score, content } = input;

    const review = await this.reviewRepository.findOne({
      userId,
      businessId,
    });

    if (review) {
      throw new HttpException('이미 리뷰를 작성하셨습니다.', 409);
    }

    await this.reviewRepository.create({
      userId,
      businessId,
      score,
      content,
    });

    return;
  }
}

export type CreateReviewInput = {
  userId: string;
  businessId: string;
  score: number;
  content: string;
};
