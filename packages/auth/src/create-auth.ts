import { db } from "@turborepo-remote-cache/db/client";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

type Options = Pick<BetterAuthOptions, "baseURL" | "secret">;

export function createAuth(options?: Options) {
	return betterAuth({
		...options,
		plugins: [reactStartCookies()],
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
