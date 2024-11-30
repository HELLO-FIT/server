import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('POST /special/facilities/:businessId/review - 리뷰 작성', () => {
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

    jest.spyOn(authService, 'getKakaoProfile').mockResolvedValue({
      kakaoId: 'kakaoId',
      email: 'test@test.com',
      nickname: 'nickname',
    });

    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.specialFacility.deleteMany();
    await prisma.specialFavorite.deleteMany();
    await prisma.review.deleteMany();
  });

  it('토큰이 없으면 401을 반환한다', async () => {
    // given
    const businessId = 'test1';

    // when
    const response = await request(app.getHttpServer()).post(
      `/special/facilities/${businessId}/review`,
    );

    // then
    expect(response.status).toBe(401);
  });

  it('score가 없으면 400을 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';
    const serialNumber = 'test1';

    // when
    const response = await request(app.getHttpServer())
      .post(`/special/facilities/${businessId}/review`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'test',
      });

    // then
    expect(response.status).toBe(400);
  });

  it('content가 없으면 400을 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';
    const serialNumber = 'test1';

    // when
    const response = await request(app.getHttpServer())
      .post(`/special/facilities/${businessId}/review`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        score: 4.5,
      });

    // then
    expect(response.status).toBe(400);
  });

  it('리뷰를 작성하고 201을 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';

    // when
    const response = await request(app.getHttpServer())
      .post(`/special/facilities/${businessId}/review`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        score: 4.5,
        content: 'test',
      });

    // then
    expect(response.status).toBe(201);
    const review = await prisma.review.findFirst();
    expect(review).toEqual({
      id: expect.any(String),
      userId: 'kakaoId',
      businessId,
      serialNumber: null,
      score: 4.5,
      content: 'test',
      createdAt: expect.any(Date),
    });
  });
});
