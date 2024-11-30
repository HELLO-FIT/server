import { Controller, Get, UseGuards, Delete, HttpCode } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { MyReviewDto } from './dto/response';

@ApiTags('/reviews')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@UseGuards(JwtGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: '내 리뷰 조회' })
  @ApiResponse({ status: 200, type: MyReviewDto, isArray: true })
  @Get('my')
  async getMyReviews(@CurrentUser() userId: string): Promise<MyReviewDto[]> {
    return this.reviewService.getManyByUserId(userId);
  }

  @ApiOperation({ summary: '리뷰 삭제' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @Delete(':reviewId')
  @HttpCode(204)
  async deleteReview(@CurrentUser() userId: string, reviewId: string) {
    await this.reviewService.deleteOne(userId, reviewId);
    return;
  }
}
