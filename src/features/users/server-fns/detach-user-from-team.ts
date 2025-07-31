import { createServerFn } from "@tanstack/react-start";
import { and, eq, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const detachUserFromTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			userId: IdSchema,
			teamId: IdSchema,
		}),
	)
	.handler(async ({ data: { teamId, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(teamMember.teamId, teamId));
		filters.push(eq(teamMember.userId, userId));

		await db.delete(teamMember).where(and(...filters));
	});

export { detachUserFromTeam };
