import { createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddNewApiKeyForAccountDialog } from "@/features/api-keys/components/add-new-api-key-for-account-dialog";
import { AllApiKeysForAccountCard } from "@/features/api-keys/components/all-api-keys-for-account-card";
import { TotalApiKeysForAccountCard } from "@/features/api-keys/components/total-api-keys-for-account-card";

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
					<h1 className="text-3xl font-bold tracking-tight">API keys</h1>
					<p className="text-muted-foreground">
						Manage your account API keys here
					</p>
				</div>

				<AddNewApiKeyForAccountDialog>
					<Button className="gap-2">
						<PlusCircleIcon className="!h-5 !w-5" />
						Add API key
					</Button>
				</AddNewApiKeyForAccountDialog>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalApiKeysForAccountCard />
			</div>

			<AllApiKeysForAccountCard />
		</div>
	);
}
