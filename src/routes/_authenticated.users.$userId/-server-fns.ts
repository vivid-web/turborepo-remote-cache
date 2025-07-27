import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, not, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { session, user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "./-schemas";

const checkIfEmailUnique = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
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

		const count = await db.$count(user, and(...filters));

		return !count;
	});

const editUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			userId: IdSchema,
			name: NameSchema,
			email: EmailSchema,
		}),
	)
	.handler(async ({ data: { userId, ...data } }) => {
		await db.update(user).set(data).where(eq(user.id, userId));
	});

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

export { checkIfEmailUnique, editUser, getSingleUser };
