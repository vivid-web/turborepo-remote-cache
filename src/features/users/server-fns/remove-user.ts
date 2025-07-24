import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const removeUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.userId));
	});

export { removeUser };
