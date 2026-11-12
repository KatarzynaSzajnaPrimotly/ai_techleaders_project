import { Migration } from "@mikro-orm/migrations";

export class Migration20261112192459 extends Migration {
  override name = "Migration20261112192459";

  override up(): void {
    this.addSql(`create table "bookings" (
      "id" uuid not null default gen_random_uuid(),
      "slot_id" uuid not null,
      "mentee_user_id" uuid not null,
      "mentor_profile_id" uuid not null,
      "length_minutes" int not null,
      "price_cents" int not null,
      "currency" varchar(3) not null default 'EUR',
      "status" varchar(24) not null,
      "starts_at" timestamptz not null,
      "booked_at" timestamptz null,
      "expires_at" timestamptz null,
      "created_at" timestamptz not null default now(),
      constraint "bookings_pkey" primary key ("id"),
      constraint "bookings_length_check" check ("length_minutes" in (25, 50)),
      constraint "bookings_price_positive_check" check ("price_cents" > 0),
      constraint "bookings_status_check" check ("status" in ('pending_payment', 'confirmed', 'completed', 'cancelled', 'expired', 'payment_failed')),
      constraint "bookings_slot_fk" foreign key ("slot_id") references "slots" ("id") on delete restrict,
      constraint "bookings_mentee_fk" foreign key ("mentee_user_id") references "users" ("id") on delete restrict,
      constraint "bookings_mentor_profile_fk" foreign key ("mentor_profile_id") references "mentor_profiles" ("id") on delete restrict
    );`);
    this.addSql(`create unique index "bookings_active_slot_unique" on "bookings" ("slot_id") where "status" in ('pending_payment', 'confirmed');`);
    this.addSql(`create index "bookings_mentee_start_idx" on "bookings" ("mentee_user_id", "starts_at");`);
    this.addSql(`create index "bookings_mentor_start_idx" on "bookings" ("mentor_profile_id", "starts_at");`);
  }

  override down(): void {
    this.addSql(`drop table "bookings";`);
  }
}
