import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq, ilike, inArray, or, SQL } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { team, teamMember, user } from "@turborepo-remote-cache/db/schema";
import * as R from "remeda";
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
		const teamFilters: Array<SQL> = [];

		if (query) {
			teamFilters.push(ilike(team.name, `%${query}%`));
			teamFilters.push(ilike(team.slug, `%${query}%`));
			teamFilters.push(ilike(team.description, `%${query}%`));
		}

		const teams = await db
			.select({
				teamId: team.id,
				name: team.name,
				createdAt: team.createdAt,
			})
			.from(team)
			.where(or(...teamFilters))
			.orderBy(asc(team.name));

		const teamMemberMap = await db
			.select({
				userId: teamMember.userId,
				teamId: teamMember.teamId,
				name: user.name,
				image: user.image,
				email: user.email,
			})
			.from(teamMember)
			.innerJoin(user, eq(teamMember.userId, user.id))
			.innerJoin(team, eq(team.id, teamMember.teamId))
			.where(inArray(team.id, teams.map(R.prop("teamId"))))
			.orderBy(asc(user.name))
			.then(R.groupByProp("teamId"));

		return teams.map((team) => {
			const members = teamMemberMap[team.teamId] ?? [];

			return { ...team, members };
		});
	});

function allTeamsQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllTeams({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "all-teams", params.query],
	});
}

function AllTeamsCard({
	query,
	onSearch,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const { data: teams } = useSuspenseQuery(allTeamsQueryOptions({ query }));

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

AllTeamsCard.queryOptions = allTeamsQueryOptions;

export { AllTeamsCard };
