import { and, eq, SQL } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { apiKey } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { DEFAULT_NAME } from "../constants";
import { ExpiresAtSchema, NameSchema } from "../schemas";
import { generateSecret } from "../utils";

const rerollApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
		z.object({
			apiKeyId: IdSchema,
			name: NameSchema,
			expiresAt: ExpiresAtSchema,
		}),
	)
	.handler(async ({ data, context: { user } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(apiKey.userId, user.id));
		filters.push(eq(apiKey.id, data.apiKeyId));

		const input = {
			...data,
			name: data.name ?? DEFAULT_NAME,
			secret: generateSecret(),
			lastUsedAt: null,
			revokedAt: null,
		};

		await db
			.update(apiKey)
			.set(input)
			.where(and(...filters));
	});

export { rerollApiKeyForAccount };
