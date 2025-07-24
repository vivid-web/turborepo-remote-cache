import { TrashIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { RemoveUserAlertDialog } from "./remove-user-alert-dialog";

type Props = React.ComponentProps<typeof Card> & {
	userId: string;
};

function UserDangerZoneCard({ userId, ...props }: Props) {
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle className="text-destructive">Danger Zone</CardTitle>
				<CardDescription>Irreversible and destructive actions</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-start">
					<RemoveUserAlertDialog userId={userId}>
						<Button variant="destructive">
							<TrashIcon className="mr-2 h-4 w-4" />
							Delete User
						</Button>
					</RemoveUserAlertDialog>
				</div>
			</CardContent>
		</Card>
	);
}

export { UserDangerZoneCard };
