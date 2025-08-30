import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ userId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.userId));
	});

export { deleteUser };
