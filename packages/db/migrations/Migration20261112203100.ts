import { Migration } from "@mikro-orm/migrations";

export class Migration20261112203100 extends Migration {
  override name = "Migration20261112203100";

  override up(): void {
    this.addSql(`create table "payment_events" ("event_id" varchar(255) not null, "processed_at" timestamptz not null default now(), constraint "payment_events_pkey" primary key ("event_id"));`);
  }

  override down(): void {
    this.addSql(`drop table "payment_events";`);
  }
}
