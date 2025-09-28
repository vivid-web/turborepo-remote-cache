import { and, eq, SQL } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { teamMember } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteTeamMember = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ teamId: IdSchema, userId: IdSchema }))
	.handler(async ({ data: { teamId, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(teamMember.teamId, teamId));
		filters.push(eq(teamMember.userId, userId));

		await db.delete(teamMember).where(and(...filters));
	});

export { deleteTeamMember };
