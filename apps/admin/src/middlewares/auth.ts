import { createMiddleware } from "@tanstack/react-start";
import {
	getRequestHeaders,
	setResponseStatus,
} from "@tanstack/react-start/server";

import { auth as betterAuth } from "@/lib/auth.server";

const auth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const headers = getRequestHeaders();

	const result = await betterAuth.api.getSession({
		headers,
		query: {
			// ensure session is fresh
			// https://www.better-auth.com/docs/concepts/session-management#cookie-cache
			disableCookieCache: true,
		},
	});

	if (!result) {
		setResponseStatus(401);

		throw new Error("Unauthorized");
	}

	return next({ context: { user: result.user } });
});

export { auth };
