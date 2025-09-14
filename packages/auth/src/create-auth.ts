import { db } from "@turborepo-remote-cache/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { env } from "./env.js";

export function createAuth() {
	return betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		basePath: "/auth",
		secret: env.BETTER_AUTH_SECRET,
		trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
		emailAndPassword: {
			enabled: true,
		},
		advanced: {
			database: {
				generateId: false,
			},
		},
		plugins: [admin()],
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
	});
}
