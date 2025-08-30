import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { RemoveTeamAlertDialog } from "./remove-team-alert-dialog";

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
					<RemoveTeamAlertDialog teamId={teamId}>
						<Button variant="destructive">
							<TrashIcon className="mr-2 h-4 w-4" />
							Delete Team
						</Button>
					</RemoveTeamAlertDialog>
				</div>
			</CardContent>
		</Card>
	);
}

export { TeamDangerZoneCard };
