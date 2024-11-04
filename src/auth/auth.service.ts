import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(kakaoAccessToken: string) {
    const kakaoId = await this.getKakaoProfile(kakaoAccessToken);
    let user = await this.userRepository.findUserById(kakaoId);
    if (!user) {
      user = await this.userRepository.createUser(kakaoId);
    }

    const accessToken = this.createAccessToken(user.id);
    return { accessToken };
  }

  async getKakaoProfile(kakaoAccessToken: string) {
    const result = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const data = await result.json();

    if (result.status !== 200 || !data.id) {
      throw new HttpException('Invalid access token', 401);
    }
    return String(data.id);
  }

  createAccessToken(id: string) {
    return this.jwtService.sign({ id });
  }
}
