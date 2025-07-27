import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, ilike, not, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { EmailSchema, NameSchema, QuerySchema } from "@/features/users/schemas";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

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

const getAllUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ query: QuerySchema.optional() }))
	.handler(async ({ data: { query } }) => {
		const filters: Array<SQL> = [];

		if (query) {
			filters.push(ilike(user.email, `%${query}%`));
			filters.push(ilike(user.name, `%${query}%`));
		}

		return db
			.select({
				userId: user.id,
				name: user.name,
				image: user.image,
				email: user.email,
			})
			.from(user)
			.where(or(...filters))
			.orderBy(asc(user.name));
	});

const getTotalUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(user));

const removeUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.userId));
	});

export {
	addNewUser,
	checkIfEmailUnique,
	editUser,
	getAllUsers,
	getTotalUsers,
	removeUser,
};
