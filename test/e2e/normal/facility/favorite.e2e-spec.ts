import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { register } from 'test/e2e/helper';
import { AuthService } from 'src/auth/auth.service';

describe('PUT /normal/facilities/:businessId/:serialNumber/favorite - 시설 찜 토글', () => {
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
    await prisma.normalFavorite.deleteMany();
  });

  it('토큰이 없으면 401을 반환한다', async () => {
    // given
    const businessId = 'test1';
    const serialNumber = 'test1';

    // when
    const response = await request(app.getHttpServer()).put(
      `/normal/facilities/${businessId}/${serialNumber}/favorite`,
    );

    // then
    expect(response.status).toBe(401);
  });

  it('찜 상태가 아니었으면 찜을 추가하고 204를 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';
    const serialNumber = 'test1';

    // when
    const response = await request(app.getHttpServer())
      .put(`/normal/facilities/${businessId}/${serialNumber}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(response.status).toBe(204);
    const favorite = await prisma.normalFavorite.findUnique({
      where: {
        userId_businessId_serialNumber: {
          userId: 'kakaoId',
          businessId,
          serialNumber,
        },
      },
    });
    expect(favorite).toBeTruthy();
  });

  it('찜 상태였으면 찜을 삭제하고 204를 반환한다', async () => {
    // given
    const accessToken = await register(app);

    const businessId = 'test1';
    const serialNumber = 'test1';

    await prisma.normalFavorite.create({
      data: {
        userId: 'kakaoId',
        businessId,
        serialNumber,
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .put(`/normal/facilities/${businessId}/${serialNumber}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(response.status).toBe(204);
    const favorite = await prisma.normalFavorite.findUnique({
      where: {
        userId_businessId_serialNumber: {
          userId: 'kakaoId',
          businessId,
          serialNumber,
        },
      },
    });
    expect(favorite).toBeNull();
  });
});
