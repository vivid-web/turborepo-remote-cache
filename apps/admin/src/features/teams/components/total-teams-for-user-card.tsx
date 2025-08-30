import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { teamMember } from "@turborepo-remote-cache/db/schema";
import { UsersIcon } from "lucide-react";
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
				<div className="flex items-center gap-2">
					<UsersIcon className="!h-4 !w-4" />
					<CardTitle className="font-medium">Total Memberships</CardTitle>
				</div>
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
