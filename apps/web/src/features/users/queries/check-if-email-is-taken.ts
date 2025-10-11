import { and, eq, not, SQL } from "@remote-cache/db";
import { user } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { EmailSchema } from "../schemas";

const checkIfEmailIsTaken = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(
		z.object({
			email: EmailSchema,
			userId: IdSchema.optional(),
		}),
	)
	.handler(async ({ data: { email, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(user.email, email));

		if (userId) {
			filters.push(not(eq(user.id, userId)));
		}

		return db.$count(user, and(...filters)).then((count) => !!count);
	});

export { checkIfEmailIsTaken };
