import { Injectable } from '@nestjs/common';
import { SpecialFacilityRepository } from './special-facility.repository';

@Injectable()
export class SpecialFacilityService {
  constructor(private specialFacilityRepository: SpecialFacilityRepository) {}

  async getManyByLocalCode(localCode: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByLocalCode(localCode);

    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }
}
