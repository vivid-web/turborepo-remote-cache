import { SquarePlusIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";

import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

const { AttachTeamMembersToUserDialog } = lazily(
	() => import("./attach-team-members-to-user-dialog"),
);

type Props = {
	userId: string;
};

function NoTeamMembershipsPlaceholder({ userId }: Props) {
	return (
		<Empty className="border border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<UsersIcon />
				</EmptyMedia>
				<EmptyTitle>No Teams Found</EmptyTitle>
				<EmptyDescription>
					This user is not a member of any teams
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<React.Suspense
					fallback={
						<Button className="gap-2" disabled>
							<Spinner />
						</Button>
					}
				>
					<AttachTeamMembersToUserDialog userId={userId}>
						<Button className="gap-2">
							<SquarePlusIcon className="!h-4 !w-4" />
							Attach Teams
						</Button>
					</AttachTeamMembersToUserDialog>
				</React.Suspense>
			</EmptyContent>
		</Empty>
	);
}

export { NoTeamMembershipsPlaceholder };
