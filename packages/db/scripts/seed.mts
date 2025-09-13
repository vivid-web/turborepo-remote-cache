import { seed } from "drizzle-seed";

import { db } from "../src/client.js";
import {
	account,
	apiKey,
	artifact,
	artifactTeam,
	session,
	team,
	teamMember,
	user,
	verification,
} from "../src/schema.js";

async function run() {
	console.log("🌱 Seeding...");
	console.time(`🌱 Database has been seeded`);

	console.time("🧹 Cleaned up the database...");

	await db.delete(apiKey);
	await db.delete(artifactTeam);
	await db.delete(artifact);
	await db.delete(teamMember);
	await db.delete(team);
	await db.delete(verification);
	await db.delete(session);
	await db.delete(account);
	await db.delete(user);

	console.timeEnd("🧹 Cleaned up the database...");

	await seed(db, {
		user,
		team,
		teamMember,
		artifact,
		artifactTeam,
		apiKey,
	}).refine((f) => ({
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
