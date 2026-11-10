import { Migration } from '@mikro-orm/migrations';
export class Migration20261110210000 extends Migration {
 override name = 'Migration20261110210000';
 override up(): void {
  this.addSql(`alter table "mentor_profiles" add "slug" varchar(60) null;`);
  this.addSql(`alter table "mentor_profiles" add "public_work_url" text null;`);
  this.addSql(`alter table "mentor_profiles" add "bio" text null;`);
  this.addSql(`alter table "mentor_profiles" add "session_channel" text null;`);
  this.addSql(`alter table "mentor_profiles" add "stack_tags" text[] not null default '{}';`);
  this.addSql(`alter table "mentor_profiles" add "published_at" timestamptz null;`);
  this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_slug_unique" unique ("slug");`);
  this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_published_slug_check" check ("published_at" is null or "slug" is not null);`);
  this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_stack_tags_check" check (array_position("stack_tags", null) is null and "stack_tags" <@ array['TypeScript', 'React', 'Python', 'AI agents']::text[]);`);
 }
 override down(): void {
  this.addSql(`alter table "mentor_profiles" drop constraint if exists "mentor_profiles_stack_tags_check";`);
  this.addSql(`alter table "mentor_profiles" drop constraint if exists "mentor_profiles_published_slug_check";`);
  this.addSql(`alter table "mentor_profiles" drop constraint if exists "mentor_profiles_slug_unique";`);
  this.addSql(`alter table "mentor_profiles" drop column if exists "published_at", drop column if exists "stack_tags", drop column if exists "session_channel", drop column if exists "bio", drop column if exists "public_work_url", drop column if exists "slug";`);
 }
}
