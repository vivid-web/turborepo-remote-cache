import { db } from "@remote-cache/db/client";
import { user } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const createUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
		z.object({
			name: NameSchema,
			email: EmailSchema,
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(user).values(data);
	});

export { createUser };
