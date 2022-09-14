import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { createTestingModule } from './create-testing-module';

let app: INestApplication;
let orm: MikroORM;

export async function getApplication() {
  if (!app) {
    const testingModule = await createTestingModule();
    app = testingModule.app;
    orm = testingModule.orm;
  }

  return { app, orm };
}
