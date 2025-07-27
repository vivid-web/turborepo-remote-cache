import { createServerFn } from "@tanstack/react-start";
import { asc, ilike, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { QuerySchema } from "../schemas";

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

export { getAllUsers };
