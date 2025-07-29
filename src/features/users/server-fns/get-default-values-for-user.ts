import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getDefaultValuesForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data: { userId } }) => {
		const [foundUser] = await db
			.select({
				userId: user.id,
				email: user.email,
				name: user.name,
			})
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!foundUser) {
			throw notFound();
		}

		return foundUser;
	});

export { getDefaultValuesForUser };
