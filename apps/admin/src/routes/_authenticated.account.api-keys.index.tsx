import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";

import { Button } from "@/components/ui/button";
import { AllApiKeysForAccountCard } from "@/features/api-keys/components/all-api-keys-for-account-card";
import { TotalApiKeysForAccountCard } from "@/features/api-keys/components/total-api-keys-for-account-card";

const { AddNewApiKeyForAccountDialog } = lazily(
	() =>
		import("@/features/api-keys/components/add-new-api-key-for-account-dialog"),
);

export const Route = createFileRoute("/_authenticated/account/api-keys/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(AllApiKeysForAccountCard.queryOptions()),
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
				<React.Suspense
					fallback={
						<Button className="gap-2" disabled>
							<Loader2Icon className="!h-5 !w-5 animate-spin" />
							Add API key
						</Button>
					}
				>
					<AddNewApiKeyForAccountDialog>
						<Button className="gap-2">
							<PlusCircleIcon className="!h-5 !w-5" />
							Add API key
						</Button>
					</AddNewApiKeyForAccountDialog>
				</React.Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalApiKeysForAccountCard />
			</div>

			<AllApiKeysForAccountCard />
		</div>
	);
}
