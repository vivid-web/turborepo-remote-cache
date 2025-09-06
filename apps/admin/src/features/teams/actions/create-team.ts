import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { team } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const createTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			name: NameSchema,
			slug: SlugSchema,
			description: DescriptionSchema,
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(team).values(data);
	});

export { createTeam };
