import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getSingleTeamQueryOptions } from "@/features/teams/queries/get-single-team-query-options";
import { AllUsersForTeamCard } from "@/features/users/components/all-users-for-team-card";
import { TotalUsersForTeamCard } from "@/features/users/components/total-users-for-team-card";
import { getAllUsersForTeamQueryOptions } from "@/features/users/queries/get-all-users-for-team-query-options";
import { getTotalUsersForTeamQueryOptions } from "@/features/users/queries/get-total-users-for-team-query-options";
import { IdSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/teams/$teamId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ teamId: IdSchema }).parse(params),
	},
	loader: async ({ context, params: { teamId } }) => {
		const [team] = await Promise.all([
			context.queryClient.ensureQueryData(
				getSingleTeamQueryOptions({ teamId }),
			),
			context.queryClient.ensureQueryData(
				getAllUsersForTeamQueryOptions({ teamId }),
			),
			context.queryClient.ensureQueryData(
				getTotalUsersForTeamQueryOptions({ teamId }),
			),
		]);

		return { crumb: team.name };
	},
});

function RouteComponent() {
	const { teamId } = Route.useParams();

	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Team Details</h1>
						<p className="text-muted-foreground">Manage team information</p>
					</div>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalUsersForTeamCard teamId={teamId} />
			</div>

			<AllUsersForTeamCard teamId={teamId} />
		</div>
	);
}
