import { createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { AddTeamDialog } from "@/features/teams/components/add-team-dialog";
import { AllTeamsCard } from "@/features/teams/components/all-teams-card";
import { TotalTeamsCard } from "@/features/teams/components/total-teams-card";
import { getAllTeamsQueryOptions } from "@/features/teams/queries/get-all-teams-query-options";
import { getTotalTeamsQueryOptions } from "@/features/teams/queries/get-total-teams-query-options";

export const Route = createFileRoute("/_authenticated/teams/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: z.string().optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps: { query } }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(getAllTeamsQueryOptions({ query })),
			context.queryClient.ensureQueryData(getTotalTeamsQueryOptions()),
		]);
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const handleSearch = async (query?: string) => {
		await navigate({
			search: (curr) => ({ ...curr, query: query || undefined }),
		});
	};

	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Teams</h1>
					<p className="text-muted-foreground">
						Manage teams and their members
					</p>
				</div>

				<AddTeamDialog>
					<Button className="gap-2">
						<PlusCircleIcon className="!h-5 !w-5" />
						Add Team
					</Button>
				</AddTeamDialog>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalTeamsCard />
			</div>

			<AllTeamsCard onSearch={handleSearch} {...search} />
		</div>
	);
}
