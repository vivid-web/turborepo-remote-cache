import { eq } from "@remote-cache/db";
import { user } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ userId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.userId));
	});

export { deleteUser };
