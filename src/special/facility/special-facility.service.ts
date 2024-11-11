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

  async getManyByLocalCodeAndItemName(localCode: string, itemName: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByLocalCodeAndItemName(
        localCode,
        itemName,
      );

    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyByFacilityName(facilityName: string) {
    const facilities =
      await this.specialFacilityRepository.findManyByFacilityName(facilityName);
    return facilities.map((facility) => {
      return {
        ...facility,
        items: facility.items.split(','),
      };
    });
  }

  async getManyPopularByLocalCode(localCode: string) {
    return await this.specialFacilityRepository.findManyPopularByLocalCode(
      localCode,
    );
  }
}
