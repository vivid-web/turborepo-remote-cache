import { init as createCuid } from "@paralleldrive/cuid2";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { apiKey } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { ExpiresAtSchema, NameSchema } from "@/features/api-keys/schemas";
import { auth } from "@/middlewares/auth";

const createApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			name: NameSchema,
			expiresAt: ExpiresAtSchema,
		}),
	)
	.handler(async ({ data, context: { user } }) => {
		const cuid = createCuid({ length: 32 });

		const input = {
			...data,
			name: data.name ?? undefined,
			secret: `sk_live_${cuid()}`,
			userId: user.id,
		};

		await db.insert(apiKey).values(input);
	});

export { createApiKeyForAccount };
