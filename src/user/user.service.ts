import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { FacilityRepository } from 'src/normal/facility/facility.repository';
import { SpecialFacilityRepository } from 'src/special/facility/special-facility.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly facilityRepository: FacilityRepository,
    private readonly specialFacilityRepository: SpecialFacilityRepository,
  ) {}

  async deleteUser(userId: string) {
    await this.userRepository.deleteUser(userId);
    return;
  }

  async getFavorites(userId: string) {
    const [normalFacilities, specialFacilities] = await Promise.all([
      this.facilityRepository.findManyByUserId(userId),
      this.specialFacilityRepository.findManyByUserId(userId),
    ]);

    return [
      ...normalFacilities.map((facility) => {
        return {
          ...facility,
          items: facility.items.split(','),
        };
      }),
      ...specialFacilities.map((facility) => {
        return {
          ...facility,
          items: facility.items.split(','),
        };
      }),
    ];
  }
}
