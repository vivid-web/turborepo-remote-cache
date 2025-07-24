import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getTotalUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema }))
	.handler(async ({ data: { teamId } }) => {
		const [item] = await db
			.select({ count: count() })
			.from(user)
			.innerJoin(teamMember, eq(teamMember.userId, user.id))
			.where(eq(teamMember.teamId, teamId));

		if (!item) {
			throw notFound();
		}

		return item.count;
	});

export { getTotalUsersForTeam };
