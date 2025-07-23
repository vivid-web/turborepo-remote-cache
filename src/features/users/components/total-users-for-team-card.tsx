import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
});

const getTotalUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		const [item] = await db
			.select({ count: count() })
			.from(teamMember)
			.where(eq(teamMember.teamId, teamId));

		if (!item) {
			throw notFound();
		}

		return item.count;
	});

function totalUsersForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getTotalUsersForTeam({ data: params }),
		queryKey: [USERS_QUERY_KEY, "total-users-for-team", params.teamId],
	});
}

function TotalUsersForTeamCard({ teamId }: Params) {
	const query = useSuspenseQuery(totalUsersForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Total Members</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Members in the system</p>
			</CardContent>
		</Card>
	);
}

TotalUsersForTeamCard.queryOptions = totalUsersForTeamQueryOptions;

export { TotalUsersForTeamCard };
