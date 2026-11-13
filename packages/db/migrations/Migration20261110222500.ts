import { Migration } from "@mikro-orm/migrations";

export class Migration20261110222500 extends Migration {
  override name = "Migration20261110222500";

  override up(): void {
    this.addSql(`alter table "mentor_profiles" add "last_published_availability_at" timestamptz null;`);
    this.addSql(`create table "slots" (
      "id" uuid not null default gen_random_uuid(),
      "mentor_profile_id" uuid not null,
      "starts_at" timestamptz not null,
      "removed_at" timestamptz null,
      "created_at" timestamptz not null default now(),
      constraint "slots_pkey" primary key ("id"),
      constraint "slots_mentor_profile_fk" foreign key ("mentor_profile_id") references "mentor_profiles" ("id") on delete cascade
    );`);
    this.addSql(`create unique index "slots_active_profile_start_unique" on "slots" ("mentor_profile_id", "starts_at") where "removed_at" is null;`);
    this.addSql(`create index "slots_profile_start_idx" on "slots" ("mentor_profile_id", "starts_at");`);
  }

  override down(): void {
    this.addSql(`drop table if exists "slots" cascade;`);
    this.addSql(`alter table "mentor_profiles" drop column if exists "last_published_availability_at";`);
  }
}
