import { and, eq, or, SQL } from "@remote-cache/db";
import { teamMember } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const checkTeamMemberDuplicates = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(z.object({ teamId: IdSchema, userId: IdSchema }).array())
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
