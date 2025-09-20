import { createServerFileRoute } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth";
import { requestLogger } from "@/middlewares/logger";

export const ServerRoute = createServerFileRoute("/api/auth/$")
	.middleware([requestLogger])
	.methods({
		GET: ({ request }) => auth.handler(request),
		POST: ({ request }) => auth.handler(request),
	});
