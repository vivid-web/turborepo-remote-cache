import { createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { QuerySchema } from "@/features/teams/schemas";

import { AddNewTeamDialog } from "./-components/add-new-team-dialog";
import { AllTeamsCard } from "./-components/all-teams-card";
import { TotalTeamsCard } from "./-components/total-teams-card";
import { allTeamsQueryOptions, totalTeamsQueryOptions } from "./-queries";

export const Route = createFileRoute("/_authenticated/teams/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: QuerySchema.optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps: search }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(allTeamsQueryOptions(search)),
			context.queryClient.ensureQueryData(totalTeamsQueryOptions()),
		]);
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const handleSearch = async (query?: string) => {
		await navigate({
			search: (curr) => ({ ...curr, query }),
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

				<AddNewTeamDialog>
					<Button className="gap-2">
						<PlusCircleIcon className="!h-5 !w-5" />
						Add Team
					</Button>
				</AddNewTeamDialog>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalTeamsCard />
			</div>

			<AllTeamsCard query={search.query} onSearch={handleSearch} />
		</div>
	);
}
