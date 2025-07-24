import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";

import { TeamMembershipsCard } from "./-components/team-memberships-card";
import { TotalTeamsCard } from "./-components/total-teams-card";
import { UserInfoCard } from "./-components/user-info-card";
import { UserSettingsCard } from "./-components/user-settings-card";
import {
	singleUserQueryOptions,
	teamMembershipsQueryOptions,
	totalTeamsQueryOptions,
} from "./-queries";

export const Route = createFileRoute("/_authenticated/users/$userId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ userId: IdSchema }).parse(params),
	},
	loader: async ({ context, params }) => {
		const [user] = await Promise.all([
			context.queryClient.ensureQueryData(singleUserQueryOptions(params)),
			context.queryClient.ensureQueryData(totalTeamsQueryOptions(params)),
			context.queryClient.ensureQueryData(teamMembershipsQueryOptions(params)),
		]);

		return { crumb: user.name };
	},
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">User Details</h1>
						<p className="text-muted-foreground">
							Manage user information and permissions
						</p>
					</div>
				</div>
			</div>

			<UserInfoCard />

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<TotalTeamsCard />
			</div>

			<TeamMembershipsCard />

			<UserSettingsCard />
		</div>
	);
}
