import { teamMember } from "@remote-cache/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const createMultipleTeamMembers = createServerFn({ method: "POST" })
	.middleware([auth])
	.inputValidator(z.object({ teamId: IdSchema, userId: IdSchema }).array())
	.handler(async ({ data }) => {
		await db.insert(teamMember).values(data);
	});

export { createMultipleTeamMembers };
