import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const checkIfSomeTeamsAreAttachedToUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(
		z.object({
			userId: IdSchema,
			teamIds: IdSchema.array(),
		}),
	)
	.handler(async ({ data: { userId, teamIds } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(user.id, userId));
		filters.push(inArray(team.id, teamIds));

		return db
			.select({ teamId: team.id })
			.from(team)
			.innerJoin(teamMember, eq(teamMember.teamId, team.id))
			.innerJoin(user, eq(teamMember.userId, user.id))
			.where(and(...filters))
			.then((result) => !!result.length);
	});

export { checkIfSomeTeamsAreAttachedToUser };
