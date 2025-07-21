import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, ilike, not, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember } from "drizzle/schema";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import {
	DescriptionSchema,
	NameSchema,
	QuerySchema,
	SlugSchema,
} from "./-schemas";

const addNewTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			name: NameSchema,
			slug: SlugSchema,
			description: DescriptionSchema.optional(),
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(team).values(data);
	});

const checkIfSlugUnique = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			id: IdSchema.optional(),
			slug: SlugSchema,
		}),
	)
	.handler(async ({ data: { slug, id } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(team.slug, slug));

		if (id) {
			filters.push(not(eq(team.id, id)));
		}

		const count = await db.$count(team, and(...filters));

		return !count;
	});

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
				id: team.id,
				name: team.name,
				slug: team.slug,
				description: team.description,
				createdAt: team.createdAt,
				memberCount: db.$count(teamMember, eq(teamMember.teamId, team.id)),
			})
			.from(team)
			.where(or(...filters))
			.orderBy(asc(team.name));
	});

const getTotalTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(team));

const removeTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(z.object({ id: IdSchema }))
	.handler(async ({ data }) => {
		await db.delete(team).where(eq(team.id, data.id));
	});

export {
	addNewTeam,
	checkIfSlugUnique,
	getAllTeams,
	getTotalTeams,
	removeTeam,
};
