import { seed } from "drizzle-seed";
import { db } from "drizzle/db";
import {
	account,
	artifact,
	session,
	team,
	teamMember,
	user,
	verification,
} from "drizzle/schema";

import { auth } from "@/lib/auth";

async function run() {
	console.log("🌱 Seeding...");
	console.time(`🌱 Database has been seeded`);

	console.time("🧹 Cleaned up the database...");

	await db.delete(artifact);
	await db.delete(teamMember);
	await db.delete(team);
	await db.delete(verification);
	await db.delete(session);
	await db.delete(account);
	await db.delete(user);

	console.timeEnd("🧹 Cleaned up the database...");

	await auth.api.signUpEmail({
		body: {
			name: "John Doe",
			email: "admin@example.com",
			password: "Test@1234",
		},
	});

	await seed(db, { user, team, teamMember, artifact }).refine((f) => ({
		user: {
			columns: { image: f.default({ defaultValue: null }) },
		},
	}));

	console.timeEnd(`🌱 Database has been seeded`);
}

try {
	await run();
} catch (e) {
	console.error(e);
	process.exit(1);
}
