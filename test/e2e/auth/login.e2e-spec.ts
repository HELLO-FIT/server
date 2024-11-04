import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

describe('POST /auth/login - 카카오 로그인', () => {
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

  it('kakaoAccessToken이 없으면 400 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).post('/auth/login');

    // then
    expect(status).toBe(400);
  });

  it('kakaoAccessToken이 유효하지 않으면 401 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ kakaoAccessToken: 'invalid' });

    // then
    expect(status).toBe(401);
  });

  it('최초 로그인시 회원가입이 진행되고, 201과 함께 accessToken을 반환한다', async () => {
    // given
    const spy = jest
      .spyOn(authService, 'getKakaoProfile')
      .mockResolvedValue('kakaoId');

    // when
    const { status, body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ kakaoAccessToken: 'valid' });

    // then
    expect(status).toBe(201);
    expect(body.accessToken).toBeTruthy();

    // cleanup
    spy.mockRestore();
  });
});
