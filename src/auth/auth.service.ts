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
    const profile = await this.getKakaoProfile(kakaoAccessToken);
    let user = await this.userRepository.findUserById(profile.kakaoId);
    if (!user) {
      user = await this.userRepository.createUser(profile);
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
    const data = (await result.json()) as {
      id: number;
      connected_at: string;
      kakao_account: {
        profile_nickname_needs_agreement: boolean;
        profile: {
          nickname: string;
        };
        has_email: boolean;
        email_needs_agreement: boolean;
        is_email_valid: boolean;
        is_email_verified: boolean;
        email: string;
      };
    };

    if (result.status !== 200 || !data.id || !data.kakao_account.email) {
      throw new HttpException('Invalid access token', 401);
    }
    console.log(data);
    return {
      kakaoId: data.id.toString(),
      email: data.kakao_account.email,
      nickname: data.kakao_account.profile.nickname,
    };
  }

  createAccessToken(id: string) {
    return this.jwtService.sign({ id });
  }
}
