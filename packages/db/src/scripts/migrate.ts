import path from "node:path";
import { MikroORM } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { getOrmOptions } from "../orm";

const command = process.argv[2];

async function main() {
  const orm = await MikroORM.init({
    ...getOrmOptions(),
    extensions: [Migrator],
    migrations: {
      path: path.resolve(__dirname, "../../migrations"),
      pathTs: path.resolve(__dirname, "../../migrations"),
    },
  });
  try {
    if (command === "create") {
      const result = await orm.migrator.create(undefined, false, process.argv[3] === "--initial");
      console.log(`Created ${result.fileName}`);
    } else if (command === "up") {
      const applied = await orm.migrator.up();
      console.log(`Applied ${applied.length} migration(s)`);
    } else if (command === "down") {
      const reverted = await orm.migrator.down();
      console.log(`Reverted ${reverted.length} migration(s)`);
    } else {
      throw new Error("Usage: migrate.ts <create|up|down>");
    }
  } finally {
    await orm.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
