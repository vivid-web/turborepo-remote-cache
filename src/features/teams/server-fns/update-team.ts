import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const updateTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			teamId: IdSchema,
			name: NameSchema,
			slug: SlugSchema,
			description: DescriptionSchema.optional(),
		}),
	)
	.handler(async ({ data: { teamId, ...data } }) => {
		await db.update(team).set(data).where(eq(team.id, teamId));
	});

export { updateTeam };
