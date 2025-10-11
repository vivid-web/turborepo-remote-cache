import { apiKey } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/lib/db";
import { auth } from "@/middlewares/auth";

import { DEFAULT_NAME } from "../constants";
import { ExpiresAtSchema, NameSchema } from "../schemas";
import { generateSecret } from "../utils";

const createApiKeyForAccount = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
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
