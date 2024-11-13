import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /special/facilities - 특수시설 목록 받기', () => {
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
  });

  it('facilityName이 없을 때 localCode가 없으면 400 에러를 반환한다', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/special/facilities',
    );

    expect(status).toBe(400);
  });

  it('200과 함께 시설 목록을 반환하되, 현재 강좌가 없는 시설은 반환하지 않는다', async () => {
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
        },
        {
          businessId: 'test2',
          name: 'test2',
          cityCode: 'test2',
          cityName: 'test2',
          localCode: '12345',
          localName: 'test2',
          address: 'test2',
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

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/special/facilities?localCode=12345',
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
        items: ['test1'],
      },
    ]);
  });

  it('시군구코드 + 종목명 조합으로 현재강좌가 있는 시설목록을 반환한다', async () => {
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

    await prisma.specialCourse.createMany({
      data: [
        {
          businessId: 'test1',
          courseId: 'test1',
          courseName: 'test1',
          itemName: '태권도',
          startTime: 'test1',
          endTime: 'test1',
          workday: 'test1',
          price: 10000,
          type: '지체',
        },
        {
          businessId: 'test2',
          courseId: 'test2',
          courseName: 'test2',
          itemName: '탁구',
          startTime: 'test2',
          endTime: 'test2',
          workday: 'test2',
          price: 20000,
          type: '지체',
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/special/facilities?localCode=12345&itemName=태권도',
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
        items: ['태권도'],
      },
    ]);
  });

  it('시설명을 검색하면 현재강좌가 있는 시설중 시설명이 포함된 특수시설을 반환한다', async () => {
    // given
    await prisma.specialFacility.createMany({
      data: [
        {
          businessId: 'test1',
          name: '죽전탁구클럽',
          cityCode: 'test1',
          cityName: 'test1',
          localCode: '12345',
          localName: 'test1',
          address: 'test1',
          detailAddress: null,
        },
        {
          businessId: 'test2',
          name: '죽전탁구클럽',
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

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/special/facilities?facilityName=죽전탁구',
    );

    // then
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        businessId: 'test1',
        name: '죽전탁구클럽',
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

  it('type이 있을 땐 허용된 type이 아니면 400에러를 반환한다', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/special/facilities?localCode=12345&type=테스트',
    );

    expect(status).toBe(400);
  });
});
