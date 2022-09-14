import { MikroORM } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

export async function createTestingModule() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const orm = moduleFixture.get<MikroORM>(MikroORM);
  await app.init();

  return { app, orm };
}
