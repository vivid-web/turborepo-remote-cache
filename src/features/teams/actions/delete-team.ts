import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(team).where(eq(team.id, data.teamId));
	});

export { deleteTeam };
