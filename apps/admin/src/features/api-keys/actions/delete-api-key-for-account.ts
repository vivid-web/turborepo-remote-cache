import { createServerFn } from "@tanstack/react-start";
import { and, eq, SQL } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { apiKey } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const deleteApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ apiKeyId: IdSchema }))
	.handler(async ({ data, context: { user } }) => {
		const filters: Array<SQL | undefined> = [];

		filters.push(eq(apiKey.userId, user.id));
		filters.push(eq(apiKey.id, data.apiKeyId));

		await db.delete(apiKey).where(and(...filters));
	});

export { deleteApiKeyForAccount };
