import { Migration } from '@mikro-orm/migrations';

export class Migration20261027165537 extends Migration {

  override name = 'Migration20261027165537';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "password_hash" text null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "password_hash";`);
  }

}
