import {
  Controller,
  UseGuards,
  Get,
  Put,
  Param,
  HttpCode,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { NotificationsDto } from './dto/response';

@ApiTags('/notifications')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({ summary: '알림 목록 조회 - 최신순으로 정렬해서 드립니다' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: NotificationsDto,
    isArray: true,
  })
  @Get()
  async getNotifications(
    @CurrentUser() userId: string,
  ): Promise<NotificationsDto[]> {
    return await this.notificationService.getNotifications(userId);
  }

  @ApiOperation({ summary: '알림 확인' })
  @ApiResponse({ status: 204, description: '성공' })
  @HttpCode(204)
  @Put(':id')
  async readNotification(@Param('id') notificationId: string) {
    await this.notificationService.readNotification(notificationId);
    return;
  }

  @ApiOperation({ summary: '알림 삭제' })
  @ApiResponse({ status: 204, description: '성공' })
  @HttpCode(204)
  @Delete(':id')
  async deleteNotification(@Param('id') notificationId: string) {
    await this.notificationService.deleteNotification(notificationId);
    return;
  }
}
