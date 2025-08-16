import { createFileRoute } from "@tanstack/react-router";

import { TotalArtifactsCard } from "@/features/artifacts/components/total-artifacts-card";

export const Route = createFileRoute("/_authenticated/artifacts/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
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
		</div>
	);
}
