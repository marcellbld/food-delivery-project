import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import mikroOrmConfig from '../mikro-orm.config';
import { MainAutomapperProfile } from './main.automapper-profile';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { MapModule } from './map/map.module';

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
    OrdersModule,
    MapModule,
  ],
  controllers: [],
  providers: [MainAutomapperProfile],
})
export class AppModule {
  constructor(private readonly orm: MikroORM) {
    (async () => {
      await this.setupOrm();
    })();
  }
  private async setupOrm() {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'prod') {
      await this.orm.getSchemaGenerator().refreshDatabase();
      await this.orm.getSeeder().seed();
    }
  }
}
