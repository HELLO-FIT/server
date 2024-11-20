import { Controller, UseGuards, Get } from '@nestjs/common';
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

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({ summary: '알림 목록 조회' })
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
}
