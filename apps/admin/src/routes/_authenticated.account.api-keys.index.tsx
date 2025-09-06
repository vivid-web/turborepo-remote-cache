import { createFileRoute } from "@tanstack/react-router";

import { TotalApiKeysForAccountCard } from "@/features/api-keys/components/total-api-keys-for-account-card";

export const Route = createFileRoute("/_authenticated/account/api-keys/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(TotalApiKeysForAccountCard.queryOptions()),
		]);
	},
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

			<div className="grid gap-4 md:grid-cols-3">
				<TotalApiKeysForAccountCard />
			</div>
		</div>
	);
}
