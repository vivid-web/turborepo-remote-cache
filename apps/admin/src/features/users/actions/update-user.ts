import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const updateUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
		z.object({
			userId: IdSchema,
			name: NameSchema,
			email: EmailSchema,
		}),
	)
	.handler(async ({ data: { userId, ...data } }) => {
		await db.update(user).set(data).where(eq(user.id, userId));
	});

export { updateUser };
