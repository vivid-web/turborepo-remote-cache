import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";

import { auth } from "@/middlewares/auth";

import { RemoveUserSchema } from "./-schemas";

const getTotalUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(user));

const removeUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(RemoveUserSchema)
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.id));
	});

export { getTotalUsers, removeUser };
