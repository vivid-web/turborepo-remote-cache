import { db } from "@turborepo-remote-cache/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { env } from "@/env.server";

function getNetlifyBaseUrl() {
	if (env.CONTEXT === "production" && env.URL) {
		return env.URL;
	}

	if (env.CONTEXT === "deploy-preview" && env.DEPLOY_PRIME_URL) {
		return env.DEPLOY_PRIME_URL;
	}

	if (env.CONTEXT === "branch-deploy" && env.DEPLOY_PRIME_URL) {
		return env.DEPLOY_PRIME_URL;
	}

	return env.BASE_URL;
}

function getBaseUrl() {
	if (env.NETLIFY) {
		return getNetlifyBaseUrl();
	}

	return env.BASE_URL;
}

const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: getBaseUrl(),
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

export { auth };
