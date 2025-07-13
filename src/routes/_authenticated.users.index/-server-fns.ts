import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";

import { auth } from "@/middlewares/auth";

import { AddNewUserSchema, RemoveUserSchema, SearchSchema } from "./-schemas";

const addNewUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(AddNewUserSchema)
	.handler(async ({ data }) => {
		await db.insert(user).values(data);
	});

const getAllUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(SearchSchema)
	.handler(async ({ data: { query } }) => {
		return await db.query.user.findMany({
			where: (users, { ilike, or }) => {
				if (!query) {
					return undefined;
				}

				return or(
					ilike(users.email, `%${query}%`),
					ilike(users.name, `%${query}%`),
				);
			},
			columns: {
				id: true,
				name: true,
				image: true,
				email: true,
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

export { addNewUser, getAllUsers, getTotalUsers, removeUser };
