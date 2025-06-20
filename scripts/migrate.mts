import { migrate as baseMigrate } from "drizzle-orm/neon-http/migrator";
import { db } from "drizzle/db";

async function migrate() {
	console.log("🔄️ Migrating database...");

	console.time("🗄️ Running DB migrations...");

	await baseMigrate(db, {
		migrationsFolder: "./drizzle/migrations",
	});

	console.timeEnd("🗄️ Running DB migrations...");

	console.log("🏁 Finished migrating!");
}

try {
	await migrate();
} catch (e) {
	console.error(e);
	process.exit(1);
}
