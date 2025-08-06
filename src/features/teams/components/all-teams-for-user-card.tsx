import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team, teamMember, user } from "drizzle/schema";
import { Loader2Icon, SquarePlusIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { AttachTeamsToUserDialog } from "./attach-teams-to-user-dialog";
import { TeamsForUserList } from "./teams-for-user-list";

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
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Team Memberships</CardTitle>
						<CardDescription>Teams this user belongs to</CardDescription>
					</div>

					<React.Suspense
						fallback={
							<Button className="gap-2" disabled>
								<Loader2Icon className="animate-spin" />
							</Button>
						}
					>
						<AttachTeamsToUserDialog userId={userId}>
							<Button className="gap-2">
								<SquarePlusIcon className="!h-4 !w-4" />
								Attach Teams
							</Button>
						</AttachTeamsToUserDialog>
					</React.Suspense>
				</div>
			</CardHeader>
			<CardContent>
				<TeamsForUserList teams={query.data} userId={userId} />
			</CardContent>
		</Card>
	);
}

AllTeamsForUserCard.queryOptions = allTeamsForUserQueryOptions;

export { AllTeamsForUserCard };
