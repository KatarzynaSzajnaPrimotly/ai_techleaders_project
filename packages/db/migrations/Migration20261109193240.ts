import { Migration } from '@mikro-orm/migrations';

export class Migration20261109193240 extends Migration {

  override name = 'Migration20261109193240';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "session_version" int not null default 0;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "session_version";`);
  }

}
