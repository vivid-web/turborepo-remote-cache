import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const checkIfSomeUsersAreAttachedToTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			teamId: IdSchema,
			userIds: IdSchema.array(),
		}),
	)
	.handler(async ({ data: { teamId, userIds } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(team.id, teamId));
		filters.push(inArray(user.id, userIds));

		return db
			.select({ userId: user.id })
			.from(user)
			.innerJoin(teamMember, eq(teamMember.userId, user.id))
			.innerJoin(team, eq(team.id, teamMember.teamId))
			.where(and(...filters))
			.then((result) => !!result.length);
	});

export { checkIfSomeUsersAreAttachedToTeam };
