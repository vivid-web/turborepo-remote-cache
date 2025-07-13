import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import {
	AddNewUserSchema,
	EditUserSchema,
	RemoveUserSchema,
	SearchSchema,
} from "./-schemas";

const addNewUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(AddNewUserSchema)
	.handler(async ({ data }) => {
		await db.insert(user).values(data);
	});

const checkIfEmailUnique = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			email: z.email(),
			id: z.string().min(1).optional(),
		}),
	)
	.handler(async ({ data: { email, id } }) => {
		const foundUser = await db.query.user.findFirst({
			columns: { id: true },
			where: (users, { eq, and, not }) => {
				const emailQuery = eq(users.email, email);

				if (!id) {
					return emailQuery;
				}

				return and(emailQuery, not(eq(users.id, id)));
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

const getAllUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(SearchSchema)
	.handler(async ({ data: { query } }) => {
		return await db.query.user.findMany({
			columns: {
				id: true,
				name: true,
				image: true,
				email: true,
			},
			orderBy: (users, { asc }) => asc(users.name),
			where: (users, { ilike, or }) => {
				if (!query) {
					return undefined;
				}

				return or(
					ilike(users.email, `%${query}%`),
					ilike(users.name, `%${query}%`),
				);
			},
		});
	});

const getTotalUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(user));

const removeUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(RemoveUserSchema)
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.id));
	});

export {
	addNewUser,
	checkIfEmailUnique,
	editUser,
	getAllUsers,
	getTotalUsers,
	removeUser,
};
