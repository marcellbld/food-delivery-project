import { TestE2eSeeder } from '../../seeders/TestE2eSeeder';
import { getApplication } from './get-application';

export const resetDb = async () => {
  const orm = (await getApplication()).orm;

  await orm.getSchemaGenerator().clearDatabase();
  await orm.getSchemaGenerator().refreshDatabase();
  await orm.getSeeder().seed(TestE2eSeeder);
};
