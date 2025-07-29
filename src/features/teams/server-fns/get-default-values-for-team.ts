import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getDefaultValuesForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema }))
	.handler(async ({ data: { teamId } }) => {
		const [foundTeam] = await db
			.select({
				teamId: team.id,
				name: team.name,
				slug: team.slug,
				description: team.description,
			})
			.from(team)
			.where(eq(team.id, teamId))
			.limit(1);

		if (!foundTeam) {
			throw notFound();
		}

		return foundTeam;
	});

export { getDefaultValuesForTeam };
