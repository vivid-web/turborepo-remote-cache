import { createServerFileRoute } from "@tanstack/react-start/server";
import { createHandler } from "@turborepo-remote-cache/api/artifact";

import { storage } from "@/lib/storage";
import { requestLogger } from "@/middlewares/logger";

const handler = createHandler({
	storage,
	basePath: "/api/v8/artifacts",
});

export const ServerRoute = createServerFileRoute("/api/v8/artifacts/$")
	.middleware([requestLogger])
	.methods({
		GET: ({ request }) => handler(request),
		POST: ({ request }) => handler(request),
		PUT: ({ request }) => handler(request),
		PATCH: ({ request }) => handler(request),
		DELETE: ({ request }) => handler(request),
		OPTIONS: ({ request }) => handler(request),
		HEAD: ({ request }) => handler(request),
	});
