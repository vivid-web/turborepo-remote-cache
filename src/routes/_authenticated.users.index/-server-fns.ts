import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";

import { auth } from "@/middlewares/auth";

import { SearchSchema } from "./-schemas";

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

export { getAllUsers, getTotalUsers };
