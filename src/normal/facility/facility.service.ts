import { Injectable, HttpException } from '@nestjs/common';
import { FacilityRepository } from './facility.repository';
import { CourseRepository } from '../course/course.repository';
import { NotificationRepository } from 'src/notifications/notification.repository';
import { ReviewRepository } from 'src/review/review.repository';

@Injectable()
export class FacilityService {
  constructor(
    private facilityRepository: FacilityRepository,
    private courseRepository: CourseRepository,
    private notificationRepository: NotificationRepository,
    private reviewRepository: ReviewRepository,
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

  async getManyPopularByLocalCodeAndItemName(
    localCode: string,
    itemName: string,
  ) {
    const facilities =
      await this.facilityRepository.findManyPopularByLocalCodeAndItemName(
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
    let reviews;

    if (userId) {
      [facility, courses, favorite, reviews] = await Promise.all([
        this.facilityRepository.findOne(businessId, serialNumber),
        this.courseRepository.findManyByFacility(businessId, serialNumber),
        this.facilityRepository.isFavorite({
          businessId,
          serialNumber,
          userId,
        }),
        this.reviewRepository.findManyNormal(businessId, serialNumber),
      ]);

      reviews = reviews.map((review) => {
        return {
          id: review.id,
          userId: review.userId,
          score: review.score,
          content: review.content,
          createdAt: review.createdAt,
          nickname: review.user.nickname,
          isMine: review.userId === userId,
        };
      });
    } else {
      [facility, courses, reviews] = await Promise.all([
        this.facilityRepository.findOne(businessId, serialNumber),
        this.courseRepository.findManyByFacility(businessId, serialNumber),
        this.reviewRepository.findManyNormal(businessId, serialNumber),
      ]);

      reviews = reviews.map((review) => {
        return {
          id: review.id,
          userId: review.userId,
          score: review.score,
          content: review.content,
          createdAt: review.createdAt,
          nickname: review.user.nickname,
          isMine: false,
        };
      });
    }

    const items = new Set(courses.map((course) => course.itemName));
    const scoreSum = reviews.reduce((acc, review) => acc + review.score, 0);
    const scoreAvg = reviews.length
      ? Math.round((scoreSum / reviews.length) * 10) / 10
      : 0;

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
      averageScore: scoreAvg,
      reviews,
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
    const result = await this.facilityRepository.toggleFavorite({
      businessId,
      serialNumber,
      userId,
    });
    if (result) {
      const [facility, courses] = await Promise.all([
        this.facilityRepository.findOne(businessId, serialNumber),
        this.courseRepository.findManyByFacility(businessId, serialNumber),
      ]);

      const notification =
        await this.notificationRepository.findOneByBusinessIdAndSerialNumber(
          userId,
          businessId,
          serialNumber,
        );

      if (notification) {
        await this.notificationRepository.delete(notification.id);
      }
      await this.notificationRepository.create({
        userId,
        businessId,
        serialNumber,
        facilityName: facility.name,
        courseNames: courses.map((course) => course.courseName),
      });
    }
    return;
  }

  async createReview(createReviewInput: CreateReviewInput) {
    const { userId, businessId, serialNumber, score, content } =
      createReviewInput;

    const review = await this.reviewRepository.findOne({
      userId,
      businessId,
      serialNumber,
    });

    if (review) {
      throw new HttpException('이미 리뷰를 작성하셨습니다.', 400);
    }

    await this.reviewRepository.create({
      userId,
      businessId,
      serialNumber,
      score,
      content,
    });

    return;
  }
}

export type CreateReviewInput = {
  userId: string;
  businessId: string;
  serialNumber: string;
  score: number;
  content: string;
};
