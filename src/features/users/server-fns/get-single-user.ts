import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { session, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const getSingleUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data: { userId } }) => {
		const [foundUser] = await db
			.select({
				userId: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
				createdAt: user.createdAt,
			})
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		const [foundSession] = await db
			.select({ lastLoggedInAt: session.createdAt })
			.from(session)
			.where(eq(session.userId, userId))
			.orderBy(desc(session.createdAt))
			.limit(1);

		if (!foundUser) {
			throw notFound();
		}

		return {
			...foundUser,
			...foundSession,
		};
	});

export { getSingleUser };
