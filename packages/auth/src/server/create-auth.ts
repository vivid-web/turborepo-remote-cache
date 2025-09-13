import { db } from "@turborepo-remote-cache/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
	return betterAuth({
		emailAndPassword: {
			enabled: true,
		},
		advanced: {
			database: {
				generateId: false,
			},
		},
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
	});
}
