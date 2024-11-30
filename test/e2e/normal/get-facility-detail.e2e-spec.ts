import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('GET /normal/facilities/:businessId/:serialNumber - 시설 상세 정보 받기', () => {
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
    await prisma.facility.deleteMany();
    await prisma.course.deleteMany();
    await prisma.review.deleteMany();
    await prisma.user.deleteMany();
  });

  it('200과 함께 시설 상세 정보를 반환한다', async () => {
    // given
    await prisma.facility.create({
      data: {
        businessId: 'test1',
        serialNumber: 'test1',
        name: 'test1',
        cityCode: 'test1',
        cityName: 'test1',
        localCode: '12345',
        localName: 'test1',
        address: 'test1',
        detailAddress: null,
        owner: 'test1',
      },
    });

    await prisma.course.create({
      data: {
        businessId: 'test1',
        facilitySerialNumber: 'test1',
        courseId: 'test1',
        courseName: 'test1',
        itemCode: 'test1',
        itemName: 'test1',
        instructor: 'test1',
        startTime: 'test1',
        endTime: 'test1',
        workday: 'test1',
        price: 10000,
      },
    });

    const accessToken = await register(app);
    await request(app.getHttpServer())
      .post('/normal/facilities/test1/test1/review')
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
        serialNumber: 'test1',
        score: 4,
        content: 'test',
      },
    });

    // when
    const { status, body } = await request(app.getHttpServer())
      .get('/normal/facilities/test1/test1')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(200);
    expect(body).toEqual({
      businessId: 'test1',
      serialNumber: 'test1',
      name: 'test1',
      cityCode: 'test1',
      cityName: 'test1',
      localCode: '12345',
      localName: 'test1',
      address: 'test1',
      detailAddress: null,
      owner: 'test1',
      phone: null,
      items: ['test1'],
      isFavorite: false,
      courses: [
        {
          courseId: 'test1',
          courseName: 'test1',
          itemName: 'test1',
          instructor: 'test1',
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
          nickname: 'nickname2',
          score: 4,
          content: 'test',
          createdAt: expect.any(String),
          isMine: false,
          userId: testUser.id,
        },
        {
          id: expect.any(String),
          nickname: 'nickname',
          score: 3,
          content: 'test',
          createdAt: expect.any(String),
          isMine: true,
          userId: 'kakaoId',
        },
      ],
    });
  });
});
