import { Migration } from '@mikro-orm/migrations';

export class Migration20261109204703 extends Migration {

  override name = 'Migration20261109204703';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "roles" text[] not null default ARRAY['mentee']::text[];`);
    this.addSql(`update "users" set "roles" = ARRAY["role"]::text[];`);
    this.addSql(`alter table "users" add constraint "users_roles_check" check (cardinality("roles") > 0 and "roles" <@ array['mentee', 'mentor']::text[]);`);
    this.addSql(`alter table "users" alter column "email_verified_at" drop not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop constraint if exists "users_roles_check";`);
    this.addSql(`alter table "users" drop column "roles";`);
    this.addSql(`alter table "users" alter column "email_verified_at" set not null;`);
  }

}
