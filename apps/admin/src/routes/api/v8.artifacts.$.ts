import { createServerFileRoute } from "@tanstack/react-start/server";
import { createHandler } from "@turborepo-remote-cache/api/artifact";

import { storage } from "@/lib/storage";

const handler = createHandler({
	storage,
	basePath: "/api/v8/artifacts",
});

export const ServerRoute = createServerFileRoute("/api/v8/artifacts/$").methods(
	{
		GET: ({ request }) => handler(request),
		POST: ({ request }) => handler(request),
		PUT: ({ request }) => handler(request),
		PATCH: ({ request }) => handler(request),
		DELETE: ({ request }) => handler(request),
		OPTIONS: ({ request }) => handler(request),
		HEAD: ({ request }) => handler(request),
	},
);
