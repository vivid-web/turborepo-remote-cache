import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getTotalTeamsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data: { userId } }) => {
		const [member] = await db
			.select({ count: count() })
			.from(teamMember)
			.where(eq(teamMember.userId, userId));

		if (!member) {
			throw notFound();
		}

		return member.count;
	});

export { getTotalTeamsForUser };
