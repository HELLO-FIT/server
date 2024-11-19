import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('PUT /special/facilities/:businessId/favorite - 특수시설 찜 토글', () => {
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
    await prisma.specialFacility.deleteMany();
    await prisma.specialFavorite.deleteMany();
  });

  it('토큰이 없으면 401을 반환한다', async () => {
    // given
    const businessId = 'test1';

    // when
    const response = await request(app.getHttpServer()).put(
      `/special/facilities/${businessId}/favorite`,
    );

    // then
    expect(response.status).toBe(401);
  });

  it('찜 상태가 아니었으면 찜을 추가하고 204를 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';

    await prisma.specialFacility.create({
      data: {
        businessId,
        name: 'test',
        cityCode: 'test',
        cityName: 'test',
        localCode: 'test',
        localName: 'test',
        address: 'test',
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .put(`/special/facilities/${businessId}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(response.status).toBe(204);
    const favorite = await prisma.specialFavorite.findUnique({
      where: { userId_businessId: { businessId, userId: 'kakaoId' } },
    });

    expect(favorite).toBeDefined();
  });

  it('찜 상태였으면 찜을 삭제하고 204를 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';

    await prisma.specialFacility.create({
      data: {
        businessId,
        name: 'test',
        cityCode: 'test',
        cityName: 'test',
        localCode: 'test',
        localName: 'test',
        address: 'test',
      },
    });

    await prisma.specialFavorite.create({
      data: { userId: 'kakaoId', businessId },
    });

    // when
    const response = await request(app.getHttpServer())
      .put(`/special/facilities/${businessId}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(response.status).toBe(204);
    const favorite = await prisma.specialFavorite.findUnique({
      where: { userId_businessId: { businessId, userId: 'kakaoId' } },
    });

    expect(favorite).toBeNull();
  });
});
