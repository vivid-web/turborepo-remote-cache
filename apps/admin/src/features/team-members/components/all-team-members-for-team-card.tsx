import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember, user } from "drizzle/schema";
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

import { TEAM_MEMBERS_QUERY_KEY } from "../constants";
import { AttachTeamMembersToTeamDialog } from "./attach-team-members-to-team-dialog";
import { TeamMembersForTeamList } from "./team-members-for-team-list";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({ teamId: IdSchema });

const getAllUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		return db
			.select({
				userId: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
			})
			.from(user)
			.innerJoin(teamMember, eq(teamMember.userId, user.id))
			.where(eq(teamMember.teamId, teamId));
	});

function allUsersForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsersForTeam({ data: params }),
		queryKey: [TEAM_MEMBERS_QUERY_KEY, "all-users-for-team", params.teamId],
	});
}

function AllTeamMembersForTeamCard({ teamId }: Params) {
	const query = useSuspenseQuery(allUsersForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="font-medium">Team Members</CardTitle>
						<CardDescription>
							A list of members that are attached to this team
						</CardDescription>
					</div>

					<React.Suspense
						fallback={
							<Button className="gap-2" disabled>
								<Loader2Icon className="animate-spin" />
							</Button>
						}
					>
						<AttachTeamMembersToTeamDialog teamId={teamId}>
							<Button className="gap-2">
								<SquarePlusIcon className="!h-4 !w-4" />
								Attach Members
							</Button>
						</AttachTeamMembersToTeamDialog>
					</React.Suspense>
				</div>
			</CardHeader>
			<CardContent>
				<TeamMembersForTeamList teamId={teamId} users={query.data} />
			</CardContent>
		</Card>
	);
}

AllTeamMembersForTeamCard.queryOptions = allUsersForTeamQueryOptions;

export { AllTeamMembersForTeamCard };
