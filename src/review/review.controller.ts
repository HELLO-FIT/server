import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MyReviewDto } from './dto/response';

@ApiTags('/reviews')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@UseGuards(JwtGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiResponse({ status: 200, type: MyReviewDto, isArray: true })
  @Get('my')
  async getMyReviews(@CurrentUser() userId: string): Promise<MyReviewDto[]> {
    return this.reviewService.getManyByUserId(userId);
  }
}
