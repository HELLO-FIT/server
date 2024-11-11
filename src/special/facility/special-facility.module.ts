import { Module } from '@nestjs/common';
import { SpecialFacilityController } from './special-facility.controller';
import { SpecialFacilityService } from './special-facility.service';
import { SpecialFacilityRepository } from './special-facility.repository';
import { SpecialCourseModule } from '../course/special-course.module';

@Module({
  imports: [SpecialCourseModule],
  controllers: [SpecialFacilityController],
  providers: [SpecialFacilityService, SpecialFacilityRepository],
})
export class SpecialFacilityModule {}
