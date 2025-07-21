import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams/")({
	component: RouteComponent,
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
		</div>
	);
}
