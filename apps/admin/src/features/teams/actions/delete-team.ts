import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { team } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const deleteTeam = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ teamId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(team).where(eq(team.id, data.teamId));
	});

export { deleteTeam };
