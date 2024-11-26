import { Injectable, HttpException } from '@nestjs/common';
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

    const allFacilities = [...normalFacilities, ...specialFacilities];

    // createdAt asc
    const sortedFacilities = allFacilities.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return sortedFacilities.map(({ createdAt: _, ...rest }) => ({
      ...rest,
      items: rest.items.split(','),
    }));
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      ...user,
      provider: 'kakao',
    };
  }
}
