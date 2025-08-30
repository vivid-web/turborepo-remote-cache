import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "drizzle/db";

export const auth = betterAuth({
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
