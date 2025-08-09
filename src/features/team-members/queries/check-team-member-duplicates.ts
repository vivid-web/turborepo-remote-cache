import { createServerFn } from "@tanstack/react-start";
import { and, eq, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const checkTeamMemberDuplicates = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema, userId: IdSchema }).array())
	.handler(async ({ data }) => {
		const filters = data.map(({ teamId, userId }) => {
			const filter: Array<SQL> = [];

			filter.push(eq(teamMember.teamId, teamId));
			filter.push(eq(teamMember.userId, userId));

			return and(...filter);
		});

		return db
			.select({ teamId: teamMember.teamId })
			.from(teamMember)
			.where(or(...filters))
			.then((result) => !!result.length);
	});

export { checkTeamMemberDuplicates };
