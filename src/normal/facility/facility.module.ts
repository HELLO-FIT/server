import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './facility.repository';
import { CourseModule } from '../course/course.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [CourseModule, NotificationModule, ReviewModule],
  controllers: [FacilityController],
  providers: [FacilityService, FacilityRepository],
  exports: [FacilityRepository],
})
export class FacilityModule {}
