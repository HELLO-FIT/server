import { Module } from '@nestjs/common';
import { CourseRepository } from './course.repository';

@Module({
  providers: [CourseRepository],
  exports: [CourseRepository],
})
export class CourseModule {}
