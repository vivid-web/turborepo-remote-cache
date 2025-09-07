import { Loader2Icon, TrashIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const { RemoveTeamAlertDialog } = lazily(
	() => import("./remove-team-alert-dialog"),
);

type Props = {
	teamId: string;
};

function DeleteTeamButton({ isLoading = false }: { isLoading?: boolean }) {
	const Icon = isLoading ? Loader2Icon : TrashIcon;

	return (
		<Button className="gap-2" variant="destructive" disabled={isLoading}>
			<Icon className={cn("!h-4 !w-4", isLoading && "animate-spin")} />
			Delete Team
		</Button>
	);
}

function TeamDangerZoneCard({ teamId }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-destructive">Danger Zone</CardTitle>
				<CardDescription>Irreversible and destructive actions</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-start">
					<React.Suspense fallback={<DeleteTeamButton isLoading />}>
						<RemoveTeamAlertDialog teamId={teamId}>
							<DeleteTeamButton />
						</RemoveTeamAlertDialog>
					</React.Suspense>
				</div>
			</CardContent>
		</Card>
	);
}

export { TeamDangerZoneCard };
