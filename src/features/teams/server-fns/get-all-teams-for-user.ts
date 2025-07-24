import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getAllTeamsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data: { userId } }) => {
		return db
			.select({ teamId: team.id, name: team.name })
			.from(team)
			.innerJoin(teamMember, eq(teamMember.teamId, team.id))
			.innerJoin(user, eq(teamMember.userId, user.id))
			.where(eq(user.id, userId));
	});

export { getAllTeamsForUser };
