import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const updateUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
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
