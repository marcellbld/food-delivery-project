import { INestApplication } from '@nestjs/common';
import * as LoginTokenSetups from '../helpers/get-login-token';
import { resetDb } from '../helpers/reset-database';
import * as request from 'supertest';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { getApplication } from '../helpers/get-application';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  const setupTokenForUser = () => LoginTokenSetups.setupTokenForUser(app);
  const setupTokenForOwner = () => LoginTokenSetups.setupTokenForOwner(app);
  const setupTokenForAdmin = () => LoginTokenSetups.setupTokenForAdmin(app);

  beforeAll(async () => {
    app = (await getApplication()).app;
  });

  beforeAll(async () => {
    await resetDb();
  });

  describe('get secondary categories with name filter (GET /categories/secondaries/:nameFilter)', () => {
    const GET_SECONDARIES_URL = '/categories/secondaries/';
    it('should return secondary categories with filter - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_SECONDARIES_URL + 'Sec')
        .expect(200)
        .then((res: request.Response) => {
          const categories = res.body;
          expect(categories.length).toBe(2);
          expect(categories[0]).toEqual({
            id: 3,
            name: 'Secondary 1',
            primary: false,
          });
          expect(categories[1]).toEqual({
            id: 4,
            name: 'Secondary 2',
            primary: false,
          });
        });
    });
    it('should return a secondary category with filter #2 - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_SECONDARIES_URL + 'Secondary 2')
        .expect(200)
        .then((res: request.Response) => {
          const categories = res.body;
          expect(categories.length).toBe(1);
          expect(categories[0]).toEqual({
            id: 4,
            name: 'Secondary 2',
            primary: false,
          });
        });
    });
    it('should return empty array if no categories found by filter - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_SECONDARIES_URL + 'Secondary 9999')
        .expect(200)
        .then((res: request.Response) => {
          const categories = res.body;
          expect(categories.length).toBe(0);
        });
    });
  });
  describe('get primary categories (GET /categories/primaries', () => {
    const GET_PRIMARIES_URL = '/categories/primaries';

    it('should return all primary categories - return 200', () => {
      return request(app.getHttpServer())
        .get(GET_PRIMARIES_URL)
        .expect(200)
        .then((res: request.Response) => {
          const categories = res.body;
          expect(categories.length).toBe(2);
          expect(categories[0]).toEqual({
            id: 1,
            name: 'Primary 1',
            primary: true,
          });
          expect(categories[1]).toEqual({
            id: 2,
            name: 'Primary 2',
            primary: true,
          });
        });
    });
  });
  describe('create secondary category (POST /categories/secondaries', () => {
    const CREATE_CATEGORY_URL = '/categories/secondaries';

    it('should create and return category as Admin - return 201', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .post(CREATE_CATEGORY_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Category',
        } as CreateCategoryDto)
        .expect(201)
        .then((res: request.Response) => {
          const category = res.body;
          expect(category).toBeTruthy();
          expect(category).toEqual({
            id: 5,
            name: 'New Category',
            primary: false,
          });
        });
    });
    it('should create and return category as Owner - return 201', async () => {
      const token = await setupTokenForOwner();

      return request(app.getHttpServer())
        .post(CREATE_CATEGORY_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Category 2',
        } as CreateCategoryDto)
        .expect(201)
        .then((res: request.Response) => {
          const category = res.body;
          expect(category).toBeTruthy();
          expect(category).toEqual({
            id: 6,
            name: 'New Category 2',
            primary: false,
          });
        });
    });
    it('should not create category as User - return 403', async () => {
      const token = await setupTokenForUser();

      return request(app.getHttpServer())
        .post(CREATE_CATEGORY_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Category 3',
        } as CreateCategoryDto)
        .expect(403);
    });
    it('should not create category with an existing name - return 400', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .post(CREATE_CATEGORY_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'Secondary 1',
        } as CreateCategoryDto)
        .expect(400);
    });
  });
});
