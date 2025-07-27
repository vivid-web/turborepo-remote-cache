import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const addNewTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			name: NameSchema,
			slug: SlugSchema,
			description: DescriptionSchema.optional(),
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(team).values(data);
	});

export { addNewTeam };
