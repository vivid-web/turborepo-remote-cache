import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { TotalTeamsCard } from "./-components/total-teams-card";
import { totalTeamsQueryOptions } from "./-queries";
import { QuerySchema } from "./-schemas";

export const Route = createFileRoute("/_authenticated/teams/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: QuerySchema.optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(totalTeamsQueryOptions());
	},
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Teams</h1>
					<p className="text-muted-foreground">
						Manage teams and their members
					</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalTeamsCard />
			</div>
		</div>
	);
}
