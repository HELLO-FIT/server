import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

describe('DELETE /users - 회원 탈퇴', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);

    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('jwt 토큰이 없으면 401 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).delete('/users');

    // then
    expect(status).toBe(401);
  });

  it('회원 탈퇴 성공시 204를 반환한다', async () => {
    // given
    jest.spyOn(authService, 'getKakaoProfile').mockResolvedValue({
      kakaoId: 'kakaoId',
      email: 'test@test.com',
      nickname: 'nickname',
    });

    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ kakaoAccessToken: 'valid' });

    // when
    const { status } = await request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(204);
    const user = await prisma.user.findFirst();

    expect(user).toBeNull();
  });
});
