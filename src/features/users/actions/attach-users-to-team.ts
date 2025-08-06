import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const attachUsersToTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			teamId: IdSchema,
			userIds: IdSchema.array(),
		}),
	)
	.handler(async ({ data: { teamId, userIds } }) => {
		const values = userIds.map((userId) => ({ userId, teamId }));

		await db.insert(teamMember).values(values);
	});

export { attachUsersToTeam };
