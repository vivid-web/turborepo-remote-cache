import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getAllUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema }))
	.handler(async ({ data: { teamId } }) => {
		return db
			.select({
				userId: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
			})
			.from(user)
			.innerJoin(teamMember, eq(teamMember.userId, user.id))
			.where(eq(teamMember.teamId, teamId));
	});

export { getAllUsersForTeam };
