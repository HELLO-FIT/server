import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /special/facilities/:businessId - 특수시설 상세 정보 받기', () => {
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

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/special/facilities/test1',
    );

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
      items: ['test1'],
      isFavorite: false,
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
    });
  });
});
