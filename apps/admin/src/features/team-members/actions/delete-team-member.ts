import { createServerFn } from "@tanstack/react-start";
import { and, eq, SQL } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { teamMember } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const deleteTeamMember = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ teamId: IdSchema, userId: IdSchema }))
	.handler(async ({ data: { teamId, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(teamMember.teamId, teamId));
		filters.push(eq(teamMember.userId, userId));

		await db.delete(teamMember).where(and(...filters));
	});

export { deleteTeamMember };
