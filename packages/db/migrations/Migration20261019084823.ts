import { Migration } from '@mikro-orm/migrations';

export class Migration20261019084823 extends Migration {

  override name = 'Migration20261019084823';

  override up(): void | Promise<void> {
    this.addSql(`create table "mentors" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "mentors" add constraint "mentors_email_unique" unique ("email");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "mentors";`);
  }

}
