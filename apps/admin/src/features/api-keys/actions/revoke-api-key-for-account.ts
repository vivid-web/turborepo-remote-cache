import { createServerFn } from "@tanstack/react-start";
import { and, eq, SQL } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { apiKey } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const revokeApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ apiKeyId: IdSchema }))
	.handler(async ({ data, context: { user } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(apiKey.userId, user.id));
		filters.push(eq(apiKey.id, data.apiKeyId));

		await db
			.update(apiKey)
			.set({ revokedAt: new Date() })
			.where(and(...filters));
	});

export { revokeApiKeyForAccount };
