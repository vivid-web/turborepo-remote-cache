import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/artifacts/")({
	component: RouteComponent,
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
		</div>
	);
}
