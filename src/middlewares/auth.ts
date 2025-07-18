import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";

import { auth as betterAuth } from "@/lib/auth";

const auth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const request = getWebRequest();

	const result = await betterAuth.api.getSession({
		headers: request.headers,
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
