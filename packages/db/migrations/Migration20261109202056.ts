import { Migration } from '@mikro-orm/migrations';

export class Migration20261109202056 extends Migration {

  override name = 'Migration20261109202056';

  override up(): void | Promise<void> {
    this.addSql(`create table "invitations" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "token_hash" varchar(64) not null, "stack_tags" text[] not null, "expires_at" timestamptz not null, "accepted_at" timestamptz null, "accepted_by_id" uuid null, "publish_due_at" timestamptz null, "revoked_at" timestamptz null, "batch" varchar(64) null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);
    this.addSql(`alter table "invitations" add constraint "invitations_token_hash_unique" unique ("token_hash");`);

    this.addSql(`create table "mentor_profiles" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "initial_publish_due_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);
    this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "invitations" add constraint "invitations_accepted_by_id_foreign" foreign key ("accepted_by_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "invitations" add constraint "invitations_accepted_pair_check" check (("accepted_at" is null) = ("accepted_by_id" is null));`);
    this.addSql(`alter table "invitations" add constraint "invitations_stack_tags_check" check (array_position("stack_tags", null) is null and "stack_tags" <@ array['TypeScript', 'React', 'Python', 'AI agents']::text[]);`);
    this.addSql(`create unique index "invitations_unresolved_email_unique" on "invitations" ("email") where "accepted_at" is null and "revoked_at" is null;`);
    this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "invitations" cascade;`);
    this.addSql(`drop table if exists "mentor_profiles" cascade;`);
  }

}
