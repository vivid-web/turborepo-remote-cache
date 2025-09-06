import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account/api-keys/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Your API keys</h1>
					<p className="text-muted-foreground">
						Manage your account API keys here
					</p>
				</div>
			</div>
		</div>
	);
}
