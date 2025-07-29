import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { TEAMS_QUERY_KEY } from "../constants";

const getTotalTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(team));

function totalTeamsQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalTeams(),
		queryKey: [TEAMS_QUERY_KEY, "total-teams"],
	});
}

function TotalTeamsCard() {
	const query = useSuspenseQuery(totalTeamsQueryOptions());

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Total Teams</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Teams in the system</p>
			</CardContent>
		</Card>
	);
}

TotalTeamsCard.queryOptions = totalTeamsQueryOptions;

export { TotalTeamsCard };
