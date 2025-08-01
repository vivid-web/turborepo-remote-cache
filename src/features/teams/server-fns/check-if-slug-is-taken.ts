import { createServerFn } from "@tanstack/react-start";
import { and, eq, not, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { SlugSchema } from "../schemas";

const checkIfSlugIsTaken = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			teamId: IdSchema.optional(),
			slug: SlugSchema,
		}),
	)
	.handler(async ({ data: { slug, teamId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(team.slug, slug));

		if (teamId) {
			filters.push(not(eq(team.id, teamId)));
		}

		return db.$count(team, and(...filters)).then((count) => !!count);
	});

export { checkIfSlugIsTaken };
