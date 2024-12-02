import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /normal/facilities/popular - 인기 있는 시설 목록 받기', () => {
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
    await prisma.facility.deleteMany();
    await prisma.course.deleteMany();
    await prisma.courseHistory.deleteMany();
    await prisma.review.deleteMany();
    await prisma.normalFavorite.deleteMany();
    await prisma.user.deleteMany();
  });

  it('localCode가 없으면 400 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).get(
      '/normal/facilities/popular',
    );

    // then
    expect(status).toBe(400);
  });

  it('200과 함께 인기 있는 시설 목록을 반환한다', async () => {
    // given
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

    await prisma.courseHistory.createMany({
      data: [
        {
          businessId: 'test1',
          facilityName: 'test1',
          itemCode: 'test1',
          itemName: 'test1',
          address: 'test1',
          courseName: 'test1',
          courseId: 'test1',
          startDate: new Date(),
          endDate: new Date(),
          participantCount: 10,
          price: 10000,
        },
        {
          businessId: 'test1',
          facilityName: 'test1',
          itemCode: 'test1',
          itemName: 'test1',
          address: 'test1',
          courseName: 'test1',
          courseId: 'test1',
          startDate: new Date(1),
          endDate: new Date(),
          participantCount: 20,
          price: 10000,
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/normal/facilities/popular?localCode=12345',
    );

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
        totalParticipantCount: 30,
        items: ['test1'],
        averageScore: 0,
        reviewCount: 0,
        favoriteCount: 0,
      },
    ]);
  });

  it('itemName이 있으면 해당 종목에 대한 인기 있는 시설 목록을 반환한다', async () => {
    // given
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

    await prisma.courseHistory.createMany({
      data: [
        {
          businessId: 'test1',
          facilityName: 'test1',
          itemCode: 'test1',
          itemName: 'test1',
          address: 'test1',
          courseName: 'test1',
          courseId: 'test1',
          startDate: new Date(),
          endDate: new Date(),
          participantCount: 10,
          price: 10000,
        },
        {
          businessId: 'test1',
          facilityName: 'test1',
          itemCode: 'test1',
          itemName: 'test1',
          address: 'test1',
          courseName: 'test1',
          courseId: 'test1',
          startDate: new Date(1),
          endDate: new Date(),
          participantCount: 20,
          price: 10000,
        },
        {
          businessId: 'test2',
          facilityName: 'test2',
          itemCode: 'test2',
          itemName: 'test2',
          address: 'test2',
          courseName: 'test2',
          courseId: 'test2',
          startDate: new Date(),
          endDate: new Date(),
          participantCount: 10,
          price: 10000,
        },
      ],
    });

    const user = await prisma.user.create({
      data: {
        id: 'test',
        email: 'test@test.com',
        nickname: 'test',
      },
    });
    const user2 = await prisma.user.create({
      data: {
        id: 'test2',
        email: 'test2test.com',
        nickname: 'test2',
      },
    });

    await prisma.normalFavorite.create({
      data: {
        userId: user.id,
        businessId: 'test1',
        serialNumber: 'test1',
      },
    });

    await prisma.normalFavorite.create({
      data: {
        userId: user2.id,
        businessId: 'test1',
        serialNumber: 'test1',
      },
    });

    await prisma.review.create({
      data: {
        userId: user.id,
        businessId: 'test1',
        serialNumber: 'test1',
        score: 4,
        content: 'test',
      },
    });

    await prisma.review.create({
      data: {
        userId: user2.id,
        businessId: 'test1',
        serialNumber: 'test1',
        score: 5,
        content: 'test',
      },
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/normal/facilities/popular?localCode=12345&itemName=test1',
    );

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
        totalParticipantCount: 30,
        items: ['test1'],
        averageScore: 4.5,
        reviewCount: 2,
        favoriteCount: 2,
      },
    ]);
  });
});
