import { INestApplication } from '@nestjs/common';
import * as LoginTokenSetups from '../helpers/get-login-token';
import { resetDb } from '../helpers/reset-database';
import * as request from 'supertest';
import { getApplication } from '../helpers/get-application';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UserRole } from '../../src/users/user-role';
import { UserDto } from '../../src/users/dto/user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const setupTokenForUser = () => LoginTokenSetups.setupTokenForUser(app);
  const setupTokenForOwner = () => LoginTokenSetups.setupTokenForOwner(app);
  const setupTokenForAdmin = () => LoginTokenSetups.setupTokenForAdmin(app);

  beforeAll(async () => {
    app = (await getApplication()).app;
    await resetDb();
  });

  describe('create new User (POST /users)', () => {
    const CREATE_USER_URL = '/users';
    it('should create User - return 201', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'user1',
          accountType: 'USER',
          password: 'pass1',
        } as CreateUserDto)
        .expect(201)
        .then((res: request.Response) => {
          const user = res.body;
          expect(user).toBeTruthy();
          expect(user).toEqual({
            id: 6,
            username: 'user1',
            role: UserRole.User,
            createdAt: expect.anything(),
          });
        });
    });
    it('should create Owner - return 201', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'owner1',
          accountType: 'OWNER',
          password: 'pass1',
        } as CreateUserDto)
        .expect(201)
        .then((res: request.Response) => {
          const user = res.body;
          expect(user).toBeTruthy();
          expect(user).toEqual({
            id: 7,
            username: 'owner1',
            role: UserRole.Owner,
            createdAt: expect.anything(),
          });
        });
    });
    it('should not create Admin - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'admin2',
          accountType: 'ADMIN',
          password: 'admin2',
        } as CreateUserDto)
        .expect(400);
    });
    it('should not create User when invalid password is provided - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'user2',
          accountType: 'USER',
          password: 'p',
        } as CreateUserDto)
        .expect(400);
    });
    it('should not create User when invalid username is provided - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'u',
          accountType: 'USER',
        } as CreateUserDto)
        .expect(400);
    });
    it('should not create User when no username is provided - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          password: 'pass2',
        } as CreateUserDto)
        .expect(400);
    });
    it('should not create User when no password is provided - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'user2',
          accountType: 'USER',
        } as CreateUserDto)
        .expect(400);
    });
    it('should not create User when no accountType is provided - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'user2',
          password: 'pass2',
        } as CreateUserDto)
        .expect(400);
    });
    it('should not create User when username already exists - return 400', async () => {
      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send({
          username: 'user1',
          accountType: 'USER',
          password: 'pass1',
        } as CreateUserDto)
        .expect(400);
    });
  });
  describe('get a user (GET /users/:id)', () => {
    const GET_USER_URL = '/users/2';
    const GET_USER_URL_WRONG = '/users/99';
    const GET_USER_URL_WRONG_2 = '/users/asd';
    it('should return a user as Admin - return 200', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .get(GET_USER_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const user = response.body as UserDto;
          expect(user).toEqual({
            id: 2,
            username: 'tuser1',
            role: UserRole.User,
            createdAt: expect.anything(),
          });
        });
    });
    it('should not return a user without token - return 403', async () => {
      return request(app.getHttpServer()).get(GET_USER_URL).expect(401);
    });
    it('should not return a user as User - return 403', async () => {
      const token = await setupTokenForUser();

      return request(app.getHttpServer())
        .get(GET_USER_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not return a user as Owner - return 403', async () => {
      const token = await setupTokenForOwner();

      return request(app.getHttpServer())
        .get(GET_USER_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not return user with invalid id #1 - return 404', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .get(GET_USER_URL_WRONG)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });
    it('should not return user with invalid id #2 - return 404', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .get(GET_USER_URL_WRONG_2)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });
  });
  describe('isUsernameTaken (GET /users/is-username-taken/:username)', () => {
    const GET_IS_USERNAME_TAKEN_URL_TAKEN = '/users/is-username-taken/tuser1';
    const GET_IS_USERNAME_TAKEN_URL_NOT_TAKEN =
      '/users/is-username-taken/tuser99';
    it('should return true if username is taken - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_IS_USERNAME_TAKEN_URL_TAKEN)
        .expect(200)
        .then((response) => {
          const result = response.text;

          expect(result).toBe('true');
        });
    });
    it('should return false if username is not taken - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_IS_USERNAME_TAKEN_URL_NOT_TAKEN)
        .expect(200)
        .then((response) => {
          const result = response.text;

          expect(result).toBe('false');
        });
    });
  });
  describe('update self (PATCH /users)', () => {
    const PATCH_UPDATE_SELF_URL = '/users';
    it('should update and return user - return 200', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(PATCH_UPDATE_SELF_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ password: 'newPass' })
        .expect(200)
        .then((response) => {
          const user = response.body;

          expect(user).toEqual({
            id: 2,
            username: 'tuser1',
            role: UserRole.User,
            createdAt: expect.anything(),
          });
        });
    });
    it('should not update without token - return 401', async () => {
      return request(app.getHttpServer())
        .patch(PATCH_UPDATE_SELF_URL)
        .send({ password: 'newPass' })
        .expect(401);
    });
  });
});
