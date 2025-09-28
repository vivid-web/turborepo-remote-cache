import { eq } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { team, teamMember, user } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Loader2Icon, SquarePlusIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";
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

import { TEAM_MEMBERS_QUERY_KEY } from "../constants";
import { TeamMembershipsForUserList } from "./team-memberships-for-user-list";

const { AttachTeamMembersToUserDialog } = lazily(
	() => import("./attach-team-members-to-user-dialog"),
);

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getAllTeamsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
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
		queryKey: [TEAM_MEMBERS_QUERY_KEY, "all-teams-for-user", params.userId],
	});
}

function AllTeamMembershipsForUserCard({ userId }: Params) {
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
						<AttachTeamMembersToUserDialog userId={userId}>
							<Button className="gap-2">
								<SquarePlusIcon className="!h-4 !w-4" />
								Attach Teams
							</Button>
						</AttachTeamMembersToUserDialog>
					</React.Suspense>
				</div>
			</CardHeader>
			<CardContent>
				<TeamMembershipsForUserList teams={query.data} userId={userId} />
			</CardContent>
		</Card>
	);
}

AllTeamMembershipsForUserCard.queryOptions = allTeamsForUserQueryOptions;

export { AllTeamMembershipsForUserCard };
