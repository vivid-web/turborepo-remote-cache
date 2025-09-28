import { eq } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { team } from "@remote-cache/db/schema";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";

const getBreadcrumbForTeam = createServerFn({ method: "GET" })
	.inputValidator(z.object({ teamId: IdSchema }))
	.handler(async ({ data: { teamId } }) => {
		const [foundTeam] = await db
			.select({ name: team.name })
			.from(team)
			.where(eq(team.id, teamId))
			.limit(1);

		if (!foundTeam) {
			throw notFound();
		}

		return foundTeam.name;
	});

export { getBreadcrumbForTeam };
