import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";

import { singleTeamQueryOptions } from "./-queries";

export const Route = createFileRoute("/_authenticated/teams/$teamId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ teamId: IdSchema }).parse(params),
	},
	loader: async ({ context, params }) => {
		const team = await context.queryClient.ensureQueryData(
			singleTeamQueryOptions(params),
		);

		return { crumb: team.name };
	},
});

function RouteComponent() {
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
		</div>
	);
}
