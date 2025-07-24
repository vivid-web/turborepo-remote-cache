import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const addNewUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			name: NameSchema,
			email: EmailSchema,
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(user).values(data);
	});

export { addNewUser };
