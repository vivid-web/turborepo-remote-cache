import { db } from "@remote-cache/db/client";
import { team } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const createTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
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
