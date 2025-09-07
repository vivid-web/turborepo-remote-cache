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

const { RemoveUserAlertDialog } = lazily(
	() => import("./remove-user-alert-dialog"),
);

type Props = {
	userId: string;
};

function DeleteUserButton({ isLoading = false }: { isLoading?: boolean }) {
	const Icon = isLoading ? Loader2Icon : TrashIcon;

	return (
		<Button className="gap-2" variant="destructive" disabled={isLoading}>
			<Icon className={cn("!h-4 !w-4", isLoading && "animate-spin")} />
			Delete User
		</Button>
	);
}

function UserDangerZoneCard({ userId }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-destructive">Danger Zone</CardTitle>
				<CardDescription>Irreversible and destructive actions</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-start">
					<React.Suspense fallback={<DeleteUserButton isLoading />}>
						<RemoveUserAlertDialog userId={userId}>
							<DeleteUserButton />
						</RemoveUserAlertDialog>
					</React.Suspense>
				</div>
			</CardContent>
		</Card>
	);
}

export { UserDangerZoneCard };
