import { getApplication } from './helpers/get-application';

afterAll(async () => {
  const app = (await getApplication()).app;
  await app.close();
});
