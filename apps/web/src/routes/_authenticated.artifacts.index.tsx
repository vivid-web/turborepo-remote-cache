import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AllArtifactsCard } from "@/features/artifacts/components/all-artifacts-card";
import { TotalArtifactsCard } from "@/features/artifacts/components/total-artifacts-card";
import { LimitSchema, PageSchema, QuerySchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/artifacts/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: QuerySchema.optional(),
		limit: LimitSchema.optional(),
		page: PageSchema.optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context: { queryClient }, deps: search }) => {
		await Promise.all([
			queryClient.ensureQueryData(AllArtifactsCard.queryOptions(search)),
			queryClient.ensureQueryData(TotalArtifactsCard.queryOptions()),
		]);
	},
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Artifacts</h1>
				<p className="text-muted-foreground">
					Browse and manage uploaded artifacts
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalArtifactsCard />
			</div>

			<AllArtifactsCard />
		</div>
	);
}
