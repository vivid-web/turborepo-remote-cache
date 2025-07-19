import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";

import { auth } from "@/middlewares/auth";

import { ParamsSchema } from "./-schemas";

const getSingleUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		const user = await db.query.user.findFirst({
			columns: {
				name: true,
			},
			where: (user, { eq }) => eq(user.id, userId),
		});

		if (!user) {
			throw notFound();
		}

		return user;
	});

export { getSingleUser };
