import { withMigrator } from "../migrator";

const command = process.argv[2];

async function main() {
  await withMigrator(async (migrator) => {
    if (command === "create") {
      const result = await migrator.create(undefined, false, process.argv[3] === "--initial");
      console.log(`Created ${result.fileName}`);
    } else if (command === "up") {
      const applied = await migrator.up();
      console.log(`Applied ${applied.length} migration(s)`);
    } else if (command === "down") {
      const reverted = await migrator.down();
      console.log(`Reverted ${reverted.length} migration(s)`);
    } else {
      throw new Error("Usage: migrate.ts <create|up|down>");
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
