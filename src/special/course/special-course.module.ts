import { Module } from '@nestjs/common';
import { SpecialCourseRepository } from './special-course.repository';

@Module({
  providers: [SpecialCourseRepository],
  exports: [SpecialCourseRepository],
})
export class SpecialCourseModule {}
