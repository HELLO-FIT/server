import { Injectable } from '@nestjs/common';
import { FacilityRepository } from './facility.repository';

@Injectable()
export class FacilityService {
  constructor(private facilityRepository: FacilityRepository) {}

  async getManyByLocalCode(localCode: string) {
    return await this.facilityRepository.findManyByLocalCode(localCode);
  }

  async getManyByLocalCodeAndItemName(localCode: string, itemName: string) {
    return await this.facilityRepository.findManyByLocalCodeAndItemName(
      localCode,
      itemName,
    );
  }

  async getManyByFacilityName(facilityName: string) {
    return await this.facilityRepository.findManyByFacilityName(facilityName);
  }
}
