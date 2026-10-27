import { Migration } from '@mikro-orm/migrations';

export class Migration20261027152348 extends Migration {

  override name = 'Migration20261027152348';

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "email" text not null, "email_verified_at" timestamptz not null, "display_name" text null, "role" text not null default 'mentee', "github_id" text null, "github_login" text null, "avatar_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_github_id_unique" unique ("github_id");`);

    this.addSql(`alter table "users" add constraint "users_role_check" check (role in ('mentee', 'mentor'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
