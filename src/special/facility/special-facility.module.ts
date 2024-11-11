import { Module } from '@nestjs/common';
import { SpecialFacilityController } from './special-facility.controller';
import { SpecialFacilityService } from './special-facility.service';
import { SpecialFacilityRepository } from './special-facility.repository';

@Module({
  controllers: [SpecialFacilityController],
  providers: [SpecialFacilityService, SpecialFacilityRepository],
})
export class SpecialFacilityModule {}
