import type { Database } from "@remote-cache/db";
import type { Database as LocalDatabase } from "@remote-cache/db/providers/local";
import type { Database as NeonDatabase } from "@remote-cache/db/providers/neon";

import { eq } from "@remote-cache/db";
import { user } from "@remote-cache/db/schema";
import { migrate as migrateNeonDatabase } from "drizzle-orm/neon-http/migrator";
import { migrate as migrateNodeDatabase } from "drizzle-orm/node-postgres/migrator";
import * as R from "remeda";

import { auth } from "@/lib/auth.server";
import { client, db } from "@/lib/db";

async function migrateAdminUser() {
	const name = process.env.ADMIN_NAME;
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!name || !email || !password) {
		console.log("👨‍💼 Missing admin information...");
		console.log("👉 Skipping migrating admin...");

		return;
	}

	const foundUser = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, email))
		.limit(1)
		.then(R.first());

	if (foundUser) {
		console.log("👨‍💼 Admin already exists...");
		console.log("👉 Skipping migrating admin...");

		return;
	}

	console.log("👨‍💼 Migrating admin user...");

	await auth.api.signUpEmail({ body: { name, email, password } });
}

async function migrateDatabase(db: Database) {
	if (process.env.DATABASE_PROVIDER === "local") {
		return migrateNodeDatabase(db as LocalDatabase, {
			migrationsFolder: "./migrations",
		});
	}

	if (process.env.DATABASE_PROVIDER === "neon") {
		return migrateNeonDatabase(db as NeonDatabase, {
			migrationsFolder: "./migrations",
		});
	}

	throw new Error("Invalid DATABASE_PROVIDER environment variable");
}

async function migrate() {
	console.log("🗄️ Migrating database...");

	await migrateDatabase(db);

	console.log("🔒 Migrating auth...");

	await migrateAdminUser();

	console.log("🏁 Finished migrating!");
}

try {
	await migrate();
} catch (e) {
	console.error(e);
	process.exit(1);
} finally {
	if ("end" in client) {
		await client.end();
	}
}
