import { createServerFn } from "@tanstack/react-start";
import { and, eq, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteTeamMember = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema, userId: IdSchema }))
	.handler(async ({ data: { teamId, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(teamMember.teamId, teamId));
		filters.push(eq(teamMember.userId, userId));

		await db.delete(teamMember).where(and(...filters));
	});

export { deleteTeamMember };
