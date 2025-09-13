import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import * as R from "remeda";

import { auth, env } from "../src/server/index.js";

async function migrateAdminUser() {
	const name = env.ADMIN_NAME;
	const email = env.ADMIN_EMAIL;
	const password = env.ADMIN_PASSWORD;

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

	await auth.api.signUpEmail({ body: { name, email, password } });
}

async function migrate() {
	console.log("🔄️ Migrating auth...");

	console.time("👨‍💼 Migrating admin user...");
	await migrateAdminUser();
	console.timeEnd("👨‍💼 Migrating admin user...");

	console.log("🏁 Finished migrating!");
}

try {
	await migrate();
} catch (e) {
	console.error(e);
	process.exit(1);
}
