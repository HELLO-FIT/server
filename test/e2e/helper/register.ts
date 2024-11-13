import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const register = async (app: INestApplication) => {
  const { body } = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ kakaoAccessToken: 'test' });

  return body.accessToken as string;
};
