import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { teamMember } from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const createMultipleTeamMembers = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ teamId: IdSchema, userId: IdSchema }).array())
	.handler(async ({ data }) => {
		await db.insert(teamMember).values(data);
	});

export { createMultipleTeamMembers };
