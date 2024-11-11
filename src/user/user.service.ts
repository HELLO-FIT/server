import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async deleteUser(userId: string) {
    await this.userRepository.deleteUser(userId);
    return;
  }
}
