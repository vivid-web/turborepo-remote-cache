import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { authMiddleware } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const createUser = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			name: NameSchema,
			email: EmailSchema,
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(user).values(data);
	});

export { createUser };
