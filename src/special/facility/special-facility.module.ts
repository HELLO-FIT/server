import { Module } from '@nestjs/common';
import { SpecialFacilityController } from './special-facility.controller';
import { SpecialFacilityService } from './special-facility.service';
import { SpecialFacilityRepository } from './special-facility.repository';
import { SpecialCourseModule } from '../course/special-course.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [SpecialCourseModule, NotificationModule, ReviewModule],
  controllers: [SpecialFacilityController],
  providers: [SpecialFacilityService, SpecialFacilityRepository],
  exports: [SpecialFacilityRepository],
})
export class SpecialFacilityModule {}
