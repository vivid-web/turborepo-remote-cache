import { eq } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { team } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const deleteTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ teamId: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(team).where(eq(team.id, data.teamId));
	});

export { deleteTeam };
