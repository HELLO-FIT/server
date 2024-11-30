import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('GET /special/facilities/:businessId - 특수시설 상세 정보 받기', () => {
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
    await prisma.specialFacility.deleteMany();
    await prisma.specialCourse.deleteMany();
    await prisma.review.deleteMany();
    await prisma.user.deleteMany();
  });

  it('존재하지 않는 businessId로 요청할 경우 404 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).get(
      '/special/facilities/123',
    );

    // then
    expect(status).toBe(404);
  });

  it('200과 함께 특수시설 상세 정보를 반환한다', async () => {
    // given
    await prisma.specialFacility.create({
      data: {
        businessId: 'test1',
        name: 'test1',
        cityCode: 'test1',
        cityName: 'test1',
        localCode: '12345',
        localName: 'test1',
        address: 'test1',
        detailAddress: null,
      },
    });

    await prisma.specialCourse.create({
      data: {
        businessId: 'test1',
        courseId: 'test1',
        courseName: 'test1',
        itemName: 'test1',
        startTime: 'test1',
        endTime: 'test1',
        workday: 'test1',
        price: 10000,
        type: '지체',
      },
    });

    const accessToken = await register(app);
    await request(app.getHttpServer())
      .post('/special/facilities/test1/review')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        score: 3,
        content: 'test',
      });

    const testUser = await prisma.user.create({
      data: {
        id: 'kakaoId2',
        email: 'test2@test.com',
        nickname: 'nickname2',
      },
    });

    await prisma.review.create({
      data: {
        userId: testUser.id,
        businessId: 'test1',
        score: 4,
        content: 'test',
      },
    });

    // when
    const { status, body } = await request(app.getHttpServer())
      .get('/special/facilities/test1')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(200);
    expect(body).toEqual({
      businessId: 'test1',
      name: 'test1',
      cityCode: 'test1',
      cityName: 'test1',
      localCode: '12345',
      localName: 'test1',
      address: 'test1',
      detailAddress: null,
      phone: null,
      isFavorite: false,
      items: ['test1'],
      types: ['지체'],
      courses: [
        {
          courseId: 'test1',
          courseName: 'test1',
          itemName: 'test1',
          startTime: 'test1',
          endTime: 'test1',
          workday: 'test1',
          price: 10000,
        },
      ],
      averageScore: 3.5,
      reviews: [
        {
          id: expect.any(String),
          userId: 'kakaoId2',
          nickname: 'nickname2',
          score: 4,
          content: 'test',
          createdAt: expect.any(String),
          isMine: false,
        },
        {
          id: expect.any(String),
          userId: 'kakaoId',
          nickname: 'nickname',
          score: 3,
          content: 'test',
          createdAt: expect.any(String),
          isMine: true,
        },
      ],
    });
  });
});
