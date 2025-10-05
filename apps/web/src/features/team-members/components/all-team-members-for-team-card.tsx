import { eq } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { teamMember, user } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { SquarePlusIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";
import { z } from "zod";

import { Show } from "@/components/show";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { TEAM_MEMBERS_QUERY_KEY } from "../constants";
import { NoTeamMembersPlaceholder } from "./no-team-members-placeholder";
import { TeamMemberItem } from "./team-member-item";

const { AttachTeamMembersToTeamDialog } = lazily(
	() => import("./attach-team-members-to-team-dialog"),
);

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({ teamId: IdSchema });

const getAllUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
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
								<Spinner />
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
				<Show
					when={query.data.length > 0}
					fallback={<NoTeamMembersPlaceholder teamId={teamId} />}
				>
					<ItemGroup className="gap-4">
						{query.data.map((teamMember) => (
							<TeamMemberItem
								teamId={teamId}
								key={teamMember.userId}
								{...teamMember}
							/>
						))}
					</ItemGroup>
				</Show>
			</CardContent>
		</Card>
	);
}

AllTeamMembersForTeamCard.queryOptions = allUsersForTeamQueryOptions;

export { AllTeamMembersForTeamCard };
