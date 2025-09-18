import {
	createServerFileRoute,
	getRequestIP,
	proxyRequest,
} from "@tanstack/react-start/server";

import { env } from "@/env";

export const ServerRoute = createServerFileRoute("/api/$").methods((api) => {
	const handler = api.handler(async ({ request, params }) => {
		const url = new URL(request.url);
		const targetUrl = new URL(
			`/${params._splat ?? ""}${url.search}`,
			env.API_URL,
		);

		const ip = getRequestIP({ xForwardedFor: true });

		await proxyRequest(targetUrl.toString(), {
			headers: { "X-Forwarded-For": ip },
		});

		return new Response();
	});

	return {
		GET: handler,
		POST: handler,
		PUT: handler,
		PATCH: handler,
		DELETE: handler,
		OPTIONS: handler,
		HEAD: handler,
	};
});
