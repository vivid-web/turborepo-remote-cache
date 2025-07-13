import { createFileRoute } from "@tanstack/react-router";

import { TotalUsersCard } from "./-components/total-users-card";
import { totalUsersQueryOptions } from "./-queries";

export const Route = createFileRoute("/_authenticated/users/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(totalUsersQueryOptions()),
		]);
	},
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users</h1>
					<p className="text-muted-foreground">
						Manage users and their access to the Turborepo cache
					</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalUsersCard />
			</div>
		</div>
	);
}
