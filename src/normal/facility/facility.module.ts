import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './facility.repository';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [CourseModule],
  controllers: [FacilityController],
  providers: [FacilityService, FacilityRepository],
  exports: [FacilityRepository],
})
export class FacilityModule {}
