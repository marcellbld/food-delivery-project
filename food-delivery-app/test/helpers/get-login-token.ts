import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const setupTokenForUser = async (
  app: INestApplication,
): Promise<string> => {
  return (
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'tuser1', password: 'pass' })
  ).body.access_token;
};
export const setupTokenForUser2 = async (
  app: INestApplication,
): Promise<string> => {
  return (
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'tuser2', password: 'pass' })
  ).body.access_token;
};
export const setupTokenForOwner = async (
  app: INestApplication,
): Promise<string> => {
  return (
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'towner1', password: 'pass' })
  ).body.access_token;
};
export const setupTokenForOwner2 = async (
  app: INestApplication,
): Promise<string> => {
  return (
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'towner2', password: 'pass' })
  ).body.access_token;
};
export const setupTokenForAdmin = async (
  app: INestApplication,
): Promise<string> => {
  return (
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
  ).body.access_token;
};
