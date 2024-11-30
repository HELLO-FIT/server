import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async getManyByUserId(userId: string) {
    const normalReviews =
      await this.reviewRepository.findManyNormalByUserId(userId);
    const specialReviews =
      await this.reviewRepository.findManySpecialByUserId(userId);

    const allReviews = [...normalReviews, ...specialReviews];
    return allReviews.sort((a, b) => {
      // 최신순
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }
}
