import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const attachTeamsToUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			userId: IdSchema,
			teamIds: IdSchema.array(),
		}),
	)
	.handler(async ({ data: { userId, teamIds } }) => {
		const values = teamIds.map((teamId) => ({ userId, teamId }));

		await db.insert(teamMember).values(values);
	});

export { attachTeamsToUser };
