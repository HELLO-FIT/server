import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getNotifications(userId: string) {
    return await this.notificationRepository.findMany(userId);
  }

  async readNotification(userId: string, notificationId: string) {
    await this.notificationRepository.readNotification(userId, notificationId);
    return;
  }
}
