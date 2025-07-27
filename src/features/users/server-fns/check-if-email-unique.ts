import { createServerFn } from "@tanstack/react-start";
import { and, eq, not, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { EmailSchema } from "../schemas";

const checkIfEmailUnique = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			email: EmailSchema,
			userId: IdSchema.optional(),
		}),
	)
	.handler(async ({ data: { email, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(user.email, email));

		if (userId) {
			filters.push(not(eq(user.id, userId)));
		}

		const count = await db.$count(user, and(...filters));

		return !count;
	});

export { checkIfEmailUnique };
