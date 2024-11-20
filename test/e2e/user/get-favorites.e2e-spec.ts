import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('GET /users/favorites - 찜한 시설 목록 조회', () => {
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
    await prisma.specialFacility.deleteMany();
    await prisma.specialCourse.deleteMany();
    await prisma.specialFavorite.deleteMany();
  });

  it('토큰이 없으면 401을 반환한다', async () => {
    // when
    const response = await request(app.getHttpServer()).get('/users/favorites');

    // then
    expect(response.status).toBe(401);
  });

  it('200과 함께 찜한 시설 목록을 반환한다', async () => {
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

    // when
    const { status, body } = await request(app.getHttpServer())
      .get('/users/favorites')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(200);
    expect(body).toEqual([
      {
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
        items: ['test1'],
      },
    ]);
  });

  it('특수 시설이면 시설일련번호가 없다', async () => {
    // given
    const accessToken = await register(app);

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

    await prisma.specialFavorite.create({
      data: {
        userId: 'kakaoId',
        businessId: 'test1',
      },
    });

    // when
    const { status, body } = await request(app.getHttpServer())
      .get('/users/favorites')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        businessId: 'test1',
        name: 'test1',
        cityCode: 'test1',
        cityName: 'test1',
        localCode: '12345',
        localName: 'test1',
        address: 'test1',
        detailAddress: null,
        items: ['test1'],
      },
    ]);
  });

  it('찜한 시설이 여러개면 시간순으로 정렬한다', async () => {
    // given
    const accessToken = await register(app);

    await prisma.facility.createMany({
      data: [
        {
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
        {
          businessId: 'test2',
          serialNumber: 'test2',
          name: 'test2',
          cityCode: 'test2',
          cityName: 'test2',
          localCode: '12345',
          localName: 'test2',
          address: 'test2',
          detailAddress: null,
          owner: 'test2',
        },
      ],
    });

    await prisma.course.createMany({
      data: [
        {
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
        {
          businessId: 'test2',
          facilitySerialNumber: 'test2',
          courseId: 'test2',
          courseName: 'test2',
          itemCode: 'test2',
          itemName: 'test2',
          instructor: 'test2',
          startTime: 'test2',
          endTime: 'test2',
          workday: 'test2',
          price: 10000,
        },
      ],
    });

    await prisma.normalFavorite.createMany({
      data: [
        {
          userId: 'kakaoId',
          businessId: 'test1',
          serialNumber: 'test1',
          createdAt: new Date('2021-01-01'),
        },
        {
          userId: 'kakaoId',
          businessId: 'test2',
          serialNumber: 'test2',
          createdAt: new Date('2021-01-02'),
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer())
      .get('/users/favorites')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(200);
    expect(body).toEqual([
      {
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
        items: ['test1'],
      },
      {
        businessId: 'test2',
        serialNumber: 'test2',
        name: 'test2',
        cityCode: 'test2',
        cityName: 'test2',
        localCode: '12345',
        localName: 'test2',
        address: 'test2',
        detailAddress: null,
        owner: 'test2',
        items: ['test2'],
      },
    ]);
  });
});
