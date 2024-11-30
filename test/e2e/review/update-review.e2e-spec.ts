import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('PUT /reviews/:reviewId - 리뷰 수정', () => {
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
    await prisma.facility.deleteMany();
    await prisma.review.deleteMany();
  });

  it('토큰이 없으면 401을 반환한다', async () => {
    // given
    // when
    const response = await request(app.getHttpServer()).put('/reviews/1');

    // then
    expect(response.status).toBe(401);
  });

  it('리뷰를 수정하고 204를 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const facility = await prisma.facility.create({
      data: {
        businessId: 'test1',
        serialNumber: 'test1',
        name: 'test1',
        cityCode: 'test1',
        cityName: 'test1',
        localCode: 'test1',
        localName: 'test1',
        address: 'test1',
        owner: 'test1',
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: 'kakaoId',
        businessId: 'test1',
        serialNumber: 'test1',
        score: 5,
        content: 'content',
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .put(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'new content',
        score: 3,
      });

    // then
    expect(response.status).toBe(204);
    const afterReview = await prisma.review.findFirst();
    expect(afterReview!.content).toBe('new content');
    expect(afterReview!.score).toBe(3);
  });
});
