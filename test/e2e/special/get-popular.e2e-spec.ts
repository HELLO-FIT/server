import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /special/facilities/popular - 인기 특수시설 목록 반환', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await prisma.specialFacility.deleteMany();
    await prisma.specialCourse.deleteMany();
    await prisma.specialCourseHistory.deleteMany();
    await prisma.review.deleteMany();
    await prisma.specialFavorite.deleteMany();
    await prisma.user.deleteMany();
  });

  it('localCode가 없으면 400에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).get(
      '/special/facilities/popular',
    );

    // then
    expect(status).toBe(400);
  });

  it('localCode가 5자리가 아니면 400에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).get(
      '/special/facilities/popular?localCode=1234',
    );

    const { status: status2 } = await request(app.getHttpServer()).get(
      '/special/facilities/popular?localCode=123456',
    );

    // then
    expect(status).toBe(400);
    expect(status2).toBe(400);
  });

  it('200과 함께 인기있는 시설을 반환한다', async () => {
    // given
    await prisma.specialFacility.createMany({
      data: [
        {
          businessId: 'test1',
          name: 'test1',
          cityCode: 'test1',
          cityName: 'test1',
          localCode: '12345',
          localName: 'test1',
          address: 'test1',
          detailAddress: null,
        },
        {
          businessId: 'test2',
          name: 'test2',
          cityCode: 'test2',
          cityName: 'test2',
          localCode: '12345',
          localName: 'test2',
          address: 'test2',
          detailAddress: null,
        },
      ],
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

    await prisma.specialCourseHistory.createMany({
      data: [
        {
          businessId: 'test1',
          facilityName: 'test1',
          itemName: 'test1',
          address: 'test1',
          courseName: 'test1',
          courseId: 'test1',
          startDate: new Date(),
          endDate: new Date(),
          participantCount: 10,
          price: 10000,
          itemCode: 'test1',
          cityCode: 'test1',
          cityName: 'test1',
          localCode: '12345',
          localName: 'test1',
        },
        {
          businessId: 'test1',
          facilityName: 'test1',
          itemName: 'test1',
          address: 'test1',
          courseName: 'test1',
          courseId: 'test1',
          startDate: new Date(1),
          endDate: new Date(),
          participantCount: 20,
          price: 10000,
          itemCode: 'test1',
          cityCode: 'test1',
          cityName: 'test1',
          localCode: '12345',
          localName: 'test1',
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/special/facilities/popular?localCode=12345',
    );

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
        totalParticipantCount: 30,
        items: ['test1'],
        averageScore: 0,
        reviewCount: 0,
        favoriteCount: 0,
      },
    ]);
  });
});
