import { eq } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { team } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const updateTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
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
