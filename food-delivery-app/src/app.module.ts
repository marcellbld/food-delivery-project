import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import mikroOrmConfig from '../mikro-orm.config';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { MainAutomapperProfile } from './main.automapper-profile';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CategoriesModule,
    RestaurantsModule,
    AuthModule,
    UsersModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService, MainAutomapperProfile],
})
export class AppModule {
  constructor(private readonly orm: MikroORM) {
    (async () => {
      await this.setupOrm();
    })();
  }
  private async setupOrm() {
    const env = process.env.NODE_ENV;
    if (env === 'development') {
      await this.orm.getSchemaGenerator().refreshDatabase();
      await this.orm.getSeeder().seed();
    }
  }
  // constructor(private readonly orm: MikroORM) {
  //   (async () => {
  //     await this.setupOrm();
  //   })();
  // }
  // private async setupOrm() {
  //   const env = process.env.NODE_ENV;
  //   if (env === 'development') {
  //     await this.orm.getSchemaGenerator().updateSchema();
  //     await this.orm.getSchemaGenerator().clearDatabase();
  //     await this.orm.getSeeder().seed(DevDatabaseSeeder);
  //   }
  //   if (env === 'test') {
  //     //ez nem megy egyszerre a teszttel
  //     // await this.orm.getSchemaGenerator().updateSchema();
  //     // await this.orm.getSchemaGenerator().clearDatabase();
  //     // await this.orm.getSeeder().seed(DevDatabaseSeeder);
  //   }
  // }
}
