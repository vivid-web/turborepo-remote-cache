import { createAuth } from "@turborepo-remote-cache/auth";
import { eq } from "@turborepo-remote-cache/db";
import { client, db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import { migrate as baseMigrate } from "drizzle-orm/node-postgres/migrator";
import * as R from "remeda";

const auth = createAuth();

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

async function migrate() {
	console.log("🗄️ Migrating database...");

	await baseMigrate(db, {
		migrationsFolder: "./migrations",
	});

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
	await client.end();
}
