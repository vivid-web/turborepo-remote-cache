import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const createMultipleTeamMembers = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ teamId: IdSchema, userId: IdSchema }).array())
	.handler(async ({ data }) => {
		await db.insert(teamMember).values(data);
	});

export { createMultipleTeamMembers };
