import { createAuth } from "@turborepo-remote-cache/auth";

import { env } from "../env.js";

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

export const auth = createAuth({
	trustedOrigins: [env.ADMIN_URL],
	baseURL: getBaseUrl(),
});
