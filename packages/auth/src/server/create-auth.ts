import { db } from "@turborepo-remote-cache/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "./env.js";

export function createAuth() {
	return betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
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
