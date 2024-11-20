import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('PUT /notifications/:id - 알림 확인', () => {
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

    jest.spyOn(authService, 'getKakaoProfile').mockResolvedValue('kakaoId');

    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.facility.deleteMany();
    await prisma.course.deleteMany();
    await prisma.normalFavorite.deleteMany();
    await prisma.specialCourse.deleteMany();
  });

  it('토큰이 없으면 401을 반환한다', async () => {
    // when
    const response = await request(app.getHttpServer()).put(
      '/notifications/test1',
    );

    // then
    expect(response.status).toBe(401);
  });

  it('204와 함께 isViewed가 true로 변경된다', async () => {
    // given
    const accessToken = await register(app);

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

    await prisma.normalFavorite.create({
      data: {
        userId: 'kakaoId',
        businessId: 'test1',
        serialNumber: 'test1',
      },
    });

    const notification = await prisma.notification.create({
      data: {
        userId: 'kakaoId',
        businessId: 'test1',
        serialNumber: 'test1',
        facilityName: 'test1',
        courseNames: ['test1'],
      },
    });

    // when
    const { status } = await request(app.getHttpServer())
      .put(`/notifications/${notification.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(204);
    const updatedNotification = await prisma.notification.findUnique({
      where: { id: notification.id },
    });
    expect(updatedNotification!.isViewed).toBe(true);
  });
});
