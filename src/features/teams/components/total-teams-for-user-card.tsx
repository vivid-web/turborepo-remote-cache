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

import { TEAMS_QUERY_KEY } from "../constants";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getTotalTeamsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		const [member] = await db
			.select({ count: count() })
			.from(teamMember)
			.where(eq(teamMember.userId, userId));

		if (!member) {
			throw notFound();
		}

		return member.count;
	});

function totalTeamsForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getTotalTeamsForUser({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "total-teams-for-user", params.userId],
	});
}

function TotalTeamsForUserCard({ userId }: Params) {
	const query = useSuspenseQuery(totalTeamsForUserQueryOptions({ userId }));

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Teams</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Active memberships</p>
			</CardContent>
		</Card>
	);
}

TotalTeamsForUserCard.queryOptions = totalTeamsForUserQueryOptions;

export { TotalTeamsForUserCard };
