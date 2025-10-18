import { createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AllTeamsCard } from "@/features/teams/components/all-teams-card";
import { TotalTeamsCard } from "@/features/teams/components/total-teams-card";
import { QuerySchema } from "@/features/teams/schemas";

const { AddNewTeamDialog } = lazily(
	() => import("@/features/teams/components/add-new-team-dialog"),
);

export const Route = createFileRoute("/_authenticated/teams/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: QuerySchema.optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context: { queryClient }, deps: search }) => {
		await Promise.all([
			queryClient.ensureQueryData(AllTeamsCard.queryOptions(search)),
			queryClient.ensureQueryData(TotalTeamsCard.queryOptions()),
		]);
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

				<React.Suspense
					fallback={
						<Button className="gap-2" disabled>
							<Spinner />
							Add Team
						</Button>
					}
				>
					<AddNewTeamDialog>
						<Button className="gap-2">
							<PlusCircleIcon className="!h-5 !w-5" />
							Add Team
						</Button>
					</AddNewTeamDialog>
				</React.Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalTeamsCard />
			</div>

			<AllTeamsCard />
		</div>
	);
}
