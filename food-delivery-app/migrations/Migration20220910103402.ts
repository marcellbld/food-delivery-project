import { Migration } from '@mikro-orm/migrations';

export class Migration20220910103402 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `category` (`id` integer not null primary key autoincrement, `name` text not null, `primary` integer not null default false);');
    this.addSql('create unique index `category_name_unique` on `category` (`name`);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `username` text not null, `password` text not null, `role` json not null, `created_at` datetime not null);');
    this.addSql('create unique index `user_username_unique` on `user` (`username`);');

    this.addSql('create table `restaurant` (`id` integer not null primary key autoincrement, `name` text not null, `image` text null, `description` text not null, `created_at` datetime not null, `modified_at` datetime not null, `owner_id` integer not null, constraint `restaurant_owner_id_foreign` foreign key(`owner_id`) references `user`(`id`) on update cascade);');
    this.addSql('create unique index `restaurant_name_unique` on `restaurant` (`name`);');
    this.addSql('create index `restaurant_owner_id_index` on `restaurant` (`owner_id`);');

    this.addSql('create table `restaurant_item` (`id` integer not null primary key autoincrement, `name` text not null, `image` text null, `description` text null, `price` integer not null, `restaurant_id` integer not null, constraint `restaurant_item_restaurant_id_foreign` foreign key(`restaurant_id`) references `restaurant`(`id`) on update cascade);');
    this.addSql('create index `restaurant_item_restaurant_id_index` on `restaurant_item` (`restaurant_id`);');

    this.addSql('create table `restaurant_categories` (`restaurant_id` integer not null, `category_id` integer not null, constraint `restaurant_categories_restaurant_id_foreign` foreign key(`restaurant_id`) references `restaurant`(`id`) on delete cascade on update cascade, constraint `restaurant_categories_category_id_foreign` foreign key(`category_id`) references `category`(`id`) on delete cascade on update cascade, primary key (`restaurant_id`, `category_id`));');
    this.addSql('create index `restaurant_categories_restaurant_id_index` on `restaurant_categories` (`restaurant_id`);');
    this.addSql('create index `restaurant_categories_category_id_index` on `restaurant_categories` (`category_id`);');

    this.addSql('create table `cart` (`id` integer not null primary key autoincrement, `purchased` integer not null default false, `purchased_date` datetime null, `restaurant_id` integer null, `user_id` integer not null, constraint `cart_restaurant_id_foreign` foreign key(`restaurant_id`) references `restaurant`(`id`) on delete set null on update cascade, constraint `cart_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on update cascade);');
    this.addSql('create index `cart_restaurant_id_index` on `cart` (`restaurant_id`);');
    this.addSql('create index `cart_user_id_index` on `cart` (`user_id`);');

    this.addSql('create table `cart_item` (`id` integer not null primary key autoincrement, `count` integer not null default 1, `cart_id` integer not null, `item_id` integer null, constraint `cart_item_cart_id_foreign` foreign key(`cart_id`) references `cart`(`id`) on delete cascade on update cascade, constraint `cart_item_item_id_foreign` foreign key(`item_id`) references `restaurant_item`(`id`) on delete set null on update cascade);');
    this.addSql('create index `cart_item_cart_id_index` on `cart_item` (`cart_id`);');
    this.addSql('create index `cart_item_item_id_index` on `cart_item` (`item_id`);');
  }

}
