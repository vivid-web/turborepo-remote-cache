import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";

const getBreadcrumbForUser = createServerFn({ method: "GET" })
	.inputValidator(z.object({ userId: IdSchema }))
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
