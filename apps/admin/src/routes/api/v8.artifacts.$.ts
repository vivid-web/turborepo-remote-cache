import { createFileRoute } from "@tanstack/react-router";
import { createHandler } from "@turborepo-remote-cache/api/artifact";

import { storage } from "@/lib/storage";

const handler = createHandler({
	storage,
	basePath: "/api/v8/artifacts",
});

export const Route = createFileRoute("/api/v8/artifacts/$")({
	server: {
		handlers: {
			GET: ({ request }) => handler(request),
			POST: ({ request }) => handler(request),
			PUT: ({ request }) => handler(request),
			PATCH: ({ request }) => handler(request),
			DELETE: ({ request }) => handler(request),
			OPTIONS: ({ request }) => handler(request),
			HEAD: ({ request }) => handler(request),
		},
	},
});
