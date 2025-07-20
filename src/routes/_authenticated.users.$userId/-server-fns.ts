import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { EditUserSchema, ParamsSchema } from "./-schemas";

const checkIfEmailUnique = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			email: z.email(),
			id: z.string().min(1),
		}),
	)
	.handler(async ({ data: { email, id } }) => {
		const foundUser = await db.query.user.findFirst({
			columns: { id: true },
			where: (users, { eq, and, not }) => {
				return and(eq(users.email, email), not(eq(users.id, id)));
			},
		});

		return !foundUser;
	});

const editUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(EditUserSchema)
	.handler(async ({ data: { id, ...data } }) => {
		await db.update(user).set(data).where(eq(user.id, id));
	});

const getSingleUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		const session = await db.query.session.findFirst({
			columns: { createdAt: true },
			where: (session, { eq }) => eq(session.userId, userId),
			orderBy: (session, { desc }) => [desc(session.createdAt)],
		});

		const user = await db.query.user.findFirst({
			columns: {
				id: true,
				email: true,
				name: true,
				image: true,
				createdAt: true,
			},
			where: (user, { eq }) => eq(user.id, userId),
		});

		if (!user) {
			throw notFound();
		}

		return {
			...user,
			lastLoggedInAt: session?.createdAt ?? null,
		};
	});

export { checkIfEmailUnique, editUser, getSingleUser };
