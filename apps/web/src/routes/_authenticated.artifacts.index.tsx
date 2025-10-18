import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { AllArtifactsCard } from "@/features/artifacts/components/all-artifacts-card";
import { TotalArtifactsCard } from "@/features/artifacts/components/total-artifacts-card";
import { QuerySchema } from "@/features/artifacts/schemas";
import { PaginationSchema } from "@/lib/pagination";

export const Route = createFileRoute("/_authenticated/artifacts/")({
	component: RouteComponent,
	validateSearch: PaginationSchema.extend({
		query: QuerySchema.optional(),
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
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const handleSearch = async (query?: string) => {
		await navigate({
			search: (curr) => ({ ...curr, query }),
		});
	};

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

			<React.Suspense fallback={<div>Loading...</div>}>
				<AllArtifactsCard {...search} onSearch={handleSearch} />
			</React.Suspense>
		</div>
	);
}
