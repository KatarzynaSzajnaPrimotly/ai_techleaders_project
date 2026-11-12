import { Migration } from "@mikro-orm/migrations";

export class Migration20261112202528 extends Migration {
  override name = "Migration20261112202528";

  override up(): void {
    this.addSql(`alter table "bookings" add column "checkout_session_id" varchar(255) null;`);
    this.addSql(`alter table "bookings" add column "payment_status" varchar(24) not null default 'not_started';`);
    this.addSql(`create unique index "bookings_checkout_session_unique" on "bookings" ("checkout_session_id") where "checkout_session_id" is not null;`);
    this.addSql(`alter table "bookings" add constraint "bookings_payment_status_check" check ("payment_status" in ('not_started', 'checkout_open', 'paid', 'refund_pending', 'refunded', 'failed'));`);
  }

  override down(): void {
    this.addSql(`alter table "bookings" drop constraint "bookings_payment_status_check";`);
    this.addSql(`drop index "bookings_checkout_session_unique";`);
    this.addSql(`alter table "bookings" drop column "payment_status";`);
    this.addSql(`alter table "bookings" drop column "checkout_session_id";`);
  }
}
