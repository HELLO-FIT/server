import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('GET /reviews/my - 내 리뷰 조회', () => {
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
    const response = await request(app.getHttpServer()).get('/reviews/my');

    // then
    expect(response.status).toBe(401);
  });

  it('내 리뷰를 조회한다', async () => {
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
        businessId: facility.businessId,
        serialNumber: facility.serialNumber,
        score: 5,
        content: 'test',
      },
    });

    // when
    const { status, body } = await request(app.getHttpServer())
      .get('/reviews/my')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body).toEqual([
      {
        id: review.id,
        businessId: 'test1',
        serialNumber: 'test1',
        score: 5,
        content: 'test',
        createdAt: expect.any(String),
        facilityName: 'test1',
        nickname: 'nickname',
      },
    ]);
  });
});
