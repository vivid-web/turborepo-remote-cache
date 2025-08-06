import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";

const getBreadcrumbForUser = createServerFn({ method: "GET" })
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data: { userId } }) => {
		const [foundUser] = await db
			.select({ name: user.name })
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!foundUser) {
			throw notFound();
		}

		return foundUser.name;
	});

export { getBreadcrumbForUser };
