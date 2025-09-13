import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { apiKey } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { authMiddleware } from "@/middlewares/auth";

import { DEFAULT_NAME } from "../constants";
import { ExpiresAtSchema, NameSchema } from "../schemas";
import { generateSecret } from "../utils";

const createApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			name: NameSchema,
			expiresAt: ExpiresAtSchema,
		}),
	)
	.handler(async ({ data, context: { user } }) => {
		const input = {
			...data,
			name: data.name ?? DEFAULT_NAME,
			secret: generateSecret(),
			userId: user.id,
		};

		await db.insert(apiKey).values(input);
	});

export { createApiKeyForAccount };
