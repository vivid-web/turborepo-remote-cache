import { SquarePlusIcon, UserIcon } from "lucide-react";
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

const { AttachTeamMembersToTeamDialog } = lazily(
	() => import("./attach-team-members-to-team-dialog"),
);

type Props = {
	teamId: string;
};

function NoTeamMembersPlaceholder({ teamId }: Props) {
	return (
		<Empty className="border border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<UserIcon />
				</EmptyMedia>
				<EmptyTitle>No Team Members Found</EmptyTitle>
				<EmptyDescription>
					This team does not have any team members
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
					<AttachTeamMembersToTeamDialog teamId={teamId}>
						<Button className="gap-2">
							<SquarePlusIcon className="!h-4 !w-4" />
							Attach Members
						</Button>
					</AttachTeamMembersToTeamDialog>
				</React.Suspense>
			</EmptyContent>
		</Empty>
	);
}

export { NoTeamMembersPlaceholder };
