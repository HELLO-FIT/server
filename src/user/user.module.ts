import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FacilityModule } from 'src/normal/facility/facility.module';
import { SpecialFacilityModule } from 'src/special/facility/special-facility.module';

@Module({
  imports: [FacilityModule, SpecialFacilityModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
