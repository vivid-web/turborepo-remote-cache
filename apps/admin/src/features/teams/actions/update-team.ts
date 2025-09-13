import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { team } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const updateTeam = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			teamId: IdSchema,
			name: NameSchema,
			slug: SlugSchema,
			description: DescriptionSchema.nullable(),
		}),
	)
	.handler(async ({ data: { teamId, ...data } }) => {
		await db.update(team).set(data).where(eq(team.id, teamId));
	});

export { updateTeam };
