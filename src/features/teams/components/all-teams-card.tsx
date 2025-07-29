import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember } from "drizzle/schema";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { TEAMS_QUERY_KEY } from "../constants";
import { QuerySchema } from "../schemas";
import { SearchTeamsForm } from "./search-teams-form";
import { TeamsTable } from "./teams-table";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	query: QuerySchema.optional(),
});

const getAllTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
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

function getAllTeamsQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllTeams({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "all-teams", params.query],
	});
}

function AllTeamsCard({
	query,
	onSearch,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const { data: teams } = useSuspenseQuery(getAllTeamsQueryOptions({ query }));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">All Teams</CardTitle>
						<CardDescription>
							A list of all teams and their members
						</CardDescription>
					</div>

					<SearchTeamsForm query={query} onSearch={onSearch} />
				</div>
			</CardHeader>
			<CardContent>
				<TeamsTable teams={teams} />
			</CardContent>
		</Card>
	);
}

AllTeamsCard.queryOptions = getAllTeamsQueryOptions;

export { AllTeamsCard };
