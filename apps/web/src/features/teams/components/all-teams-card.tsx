import { asc, eq, ilike, inArray, or, SQL } from "@remote-cache/db";
import { team, teamMember, user } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as R from "remeda";
import { z } from "zod";

import { SearchForm } from "@/components/search-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/middlewares/auth";

import { TEAMS_QUERY_KEY } from "../constants";
import { QuerySchema } from "../schemas";
import { TeamsTable } from "./teams-table";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	query: QuerySchema.optional(),
});

const getAllTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
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

const routeApi = getRouteApi("/_authenticated/teams/");

function AllTeamsCard() {
	const query = routeApi.useSearch({
		select: (state) => state.query,
	});

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

					<SearchForm
						routeId="/_authenticated/teams/"
						placeholder="Search teams..."
					/>
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
