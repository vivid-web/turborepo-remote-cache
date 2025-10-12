import { invariant } from "@remote-cache/core";
import { count, eq } from "@remote-cache/db";
import { teamMember } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { UserIcon } from "lucide-react";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
});

const getTotalUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		const [result] = await db
			.select({ count: count() })
			.from(teamMember)
			.where(eq(teamMember.teamId, teamId));

		invariant(result, "Failed to count team members for team");

		return result.count;
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
				<div className="flex items-center gap-2">
					<UserIcon className="!h-4 !w-4" />
					<CardTitle className="font-medium">Total Members</CardTitle>
				</div>
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
