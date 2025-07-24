import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember, user } from "drizzle/schema";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { TEAMS_QUERY_KEY } from "../constants";
import { TeamsList } from "./teams-list";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getAllTeamsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		return db
			.select({ teamId: team.id, name: team.name })
			.from(team)
			.innerJoin(teamMember, eq(teamMember.teamId, team.id))
			.innerJoin(user, eq(teamMember.userId, user.id))
			.where(eq(user.id, userId));
	});

function allTeamsForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllTeamsForUser({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "all-teams-for-user", params.userId],
	});
}

function AllTeamsForUserCard({ userId }: Params) {
	const query = useSuspenseQuery(allTeamsForUserQueryOptions({ userId }));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Team Memberships</CardTitle>
				<CardDescription>Teams this user belongs to</CardDescription>
			</CardHeader>
			<CardContent>
				<TeamsList teams={query.data} />
			</CardContent>
		</Card>
	);
}

AllTeamsForUserCard.queryOptions = allTeamsForUserQueryOptions;

export { AllTeamsForUserCard };
