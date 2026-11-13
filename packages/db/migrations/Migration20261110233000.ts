import { Migration } from "@mikro-orm/migrations";

export class Migration20261110233000 extends Migration {
  override name = "Migration20261110233000";

  override up(): void {
    this.addSql(`alter table "mentor_profiles" add "price_25_cents" integer null;`);
    this.addSql(`alter table "mentor_profiles" add "price_50_cents" integer null;`);
    this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_price_25_positive_check" check ("price_25_cents" is null or "price_25_cents" > 0);`);
    this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_price_50_positive_check" check ("price_50_cents" is null or "price_50_cents" > 0);`);
    this.addSql(`alter table "mentor_profiles" add constraint "mentor_profiles_prices_pair_check" check (("price_25_cents" is null) = ("price_50_cents" is null));`);
  }

  override down(): void {
    this.addSql(`alter table "mentor_profiles" drop constraint if exists "mentor_profiles_prices_pair_check";`);
    this.addSql(`alter table "mentor_profiles" drop constraint if exists "mentor_profiles_price_50_positive_check";`);
    this.addSql(`alter table "mentor_profiles" drop constraint if exists "mentor_profiles_price_25_positive_check";`);
    this.addSql(`alter table "mentor_profiles" drop column if exists "price_50_cents";`);
    this.addSql(`alter table "mentor_profiles" drop column if exists "price_25_cents";`);
  }
}
