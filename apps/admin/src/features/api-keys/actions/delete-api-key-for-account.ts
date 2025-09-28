import { and, eq, SQL } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { apiKey } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ apiKeyId: IdSchema }))
	.handler(async ({ data, context: { user } }) => {
		const filters: Array<SQL | undefined> = [];

		filters.push(eq(apiKey.userId, user.id));
		filters.push(eq(apiKey.id, data.apiKeyId));

		await db.delete(apiKey).where(and(...filters));
	});

export { deleteApiKeyForAccount };
