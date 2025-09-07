import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";

import { Button } from "@/components/ui/button";
import { AllApiKeysForAccountCard } from "@/features/api-keys/components/all-api-keys-for-account-card";
import { TotalApiKeysForAccountCard } from "@/features/api-keys/components/total-api-keys-for-account-card";
import { cn } from "@/lib/utils";

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

function AddApiKeyButton({ isLoading = false }: { isLoading?: boolean }) {
	const Icon = isLoading ? Loader2Icon : PlusCircleIcon;

	return (
		<Button className="gap-2" disabled={isLoading}>
			<Icon className={cn("!h-5 !w-5", isLoading && "animate-spin")} />
			Add API key
		</Button>
	);
}

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
				<React.Suspense fallback={<AddApiKeyButton isLoading />}>
					<AddNewApiKeyForAccountDialog>
						<AddApiKeyButton />
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
