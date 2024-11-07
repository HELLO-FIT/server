import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /normal/facilities - 시설 목록 받기', () => {
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
  });

  it('localCode가 없으면 400 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).get(
      '/normal/facilities',
    );

    // then
    expect(status).toBe(400);
  });

  it('200과 함께 시설 목록을 반환하되, 현재 강좌가 없는 시설은 반환하지 않는다', async () => {
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

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/normal/facilities?localCode=12345',
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
      },
    ]);
  });

  it('종목명을 입력하면 해당종목 현재강좌가 있는 시설 목록을 반환한다', async () => {
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
          itemName: '태권도',
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
          itemName: '탁구',
          instructor: 'test2',
          startTime: 'test2',
          endTime: 'test2',
          workday: 'test2',
          price: 20000,
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/normal/facilities?localCode=12345&itemName=태권도',
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
      },
    ]);
  });
});
