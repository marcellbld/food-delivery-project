import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { resetDb } from '../helpers/reset-database';
import { getApplication } from '../helpers/get-application';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = (await getApplication()).app;
  });

  beforeAll(async () => {
    await resetDb();
  });

  describe('login (POST /auth/login)', () => {
    const URL = '/auth/login';
    it('should login with correct username and password and return token', () => {
      return request(app.getHttpServer())
        .post(URL)
        .send({ username: 'tuser1', password: 'pass' })
        .expect(201)
        .then((response) => {
          const token = response.body.access_token;
          expect(token).toBeTruthy();
        });
    });
    it('should not login with incorrect username', () => {
      return request(app.getHttpServer())
        .post(URL)
        .send({ username: 'tuser111', password: 'pass' })
        .expect(401);
    });
    it('should not login with incorrect password', () => {
      return request(app.getHttpServer())
        .post(URL)
        .send({ username: 'tuser1', password: 'pass1' })
        .expect(401);
    });
  });
});
