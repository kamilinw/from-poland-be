import { Migration } from '@mikro-orm/migrations';

export class Migration20250516133930 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "from_poland";`);
    this.addSql(
      `create table "from_poland"."transaction" ("id" serial primary key, "amount_pln" bigint not null, "amount_eur" bigint not null, "currency_rate" int not null, "created_at" timestamptz not null);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "from_poland"."transaction" cascade;`);

    this.addSql(`drop schema if exists "from_poland";`);
  }
}
