import { TrashIcon } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";

const { RemoveTeamAlertDialog } = lazily(
	() => import("./remove-team-alert-dialog"),
);

type Props = {
	teamId: string;
};

function TeamDangerZoneCard({ teamId }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-destructive">Danger Zone</CardTitle>
				<CardDescription>Irreversible and destructive actions</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-start">
					<React.Suspense
						fallback={
							<Button variant="destructive" disabled>
								<Spinner />
								Delete Team
							</Button>
						}
					>
						<RemoveTeamAlertDialog teamId={teamId}>
							<Button variant="destructive">
								<TrashIcon className="mr-2 h-4 w-4" />
								Delete Team
							</Button>
						</RemoveTeamAlertDialog>
					</React.Suspense>
				</div>
			</CardContent>
		</Card>
	);
}

export { TeamDangerZoneCard };
