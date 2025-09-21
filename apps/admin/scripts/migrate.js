import { client, db } from "@turborepo-remote-cache/db/client";
import { migrate as baseMigrate } from "drizzle-orm/node-postgres/migrator";

async function migrate() {
	console.log("🗄️ Migrating database...");

	await baseMigrate(db, {
		migrationsFolder: "./migrations",
	});

	console.log("🏁 Finished migrating!");
}

try {
	await migrate();
} catch (e) {
	console.error(e);
	process.exit(1);
} finally {
	await client.end();
}
