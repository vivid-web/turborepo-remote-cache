import { createServerFn } from "@tanstack/react-start";
import { asc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember } from "drizzle/schema";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { QuerySchema } from "../schemas";

const getAllTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(z.object({ query: QuerySchema.optional() }))
	.handler(async ({ data: { query } }) => {
		const filters: Array<SQL> = [];

		if (query) {
			filters.push(ilike(team.name, `%${query}%`));
			filters.push(ilike(team.slug, `%${query}%`));
			filters.push(ilike(team.description, `%${query}%`));
		}

		return db
			.select({
				teamId: team.id,
				name: team.name,
				createdAt: team.createdAt,
				memberCount: db.$count(teamMember, eq(teamMember.teamId, team.id)),
			})
			.from(team)
			.where(or(...filters))
			.orderBy(asc(team.name));
	});

export { getAllTeams };
