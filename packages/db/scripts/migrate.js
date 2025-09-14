import { migrate as baseMigrate } from "drizzle-orm/node-postgres/migrator";

import { client, db } from "../dist/client.js";

async function migrate() {
	console.log("🔄️ Migrating database...");

	console.time("🗄️ Running DB migrations...");

	await baseMigrate(db, {
		migrationsFolder: "./migrations",
	});

	console.timeEnd("🗄️ Running DB migrations...");

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
