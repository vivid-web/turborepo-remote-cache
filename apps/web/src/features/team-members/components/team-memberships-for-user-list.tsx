import { Link } from "@tanstack/react-router";
import { MoreVerticalIcon, SquarePlusIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

const { AttachTeamMembersToUserDialog } = lazily(
	() => import("./attach-team-members-to-user-dialog"),
);

const { DetachTeamMemberFromUserAlertDialog } = lazily(
	() => import("./detach-team-member-from-user-alert-dialog"),
);

type Params = {
	userId: string;
};

type Team = {
	name: string;
	teamId: string;
};

function FilledListItem({ name, teamId, userId }: Params & Team) {
	return (
		<Item variant="outline">
			<ItemMedia variant="icon">
				<UsersIcon />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{name}</ItemTitle>
			</ItemContent>
			<ItemActions>
				<React.Suspense
					fallback={
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" disabled>
									<Spinner />
								</Button>
							</DropdownMenuTrigger>
						</DropdownMenu>
					}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<MoreVerticalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link to="/teams/$teamId" params={{ teamId }}>
									View
								</Link>
							</DropdownMenuItem>
							<DetachTeamMemberFromUserAlertDialog
								teamId={teamId}
								userId={userId}
							>
								<DropdownMenuItem
									className="text-destructive"
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									Detach
								</DropdownMenuItem>
							</DetachTeamMemberFromUserAlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</React.Suspense>
			</ItemActions>
		</Item>
	);
}

function EmptyListItem({ userId }: Params) {
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

function TeamMembershipsForUserList({
	teams,
	userId,
}: Params & { teams: Array<Team> }) {
	if (teams.length === 0) {
		return <EmptyListItem userId={userId} />;
	}

	return (
		<ItemGroup className="gap-4">
			{teams.map((team) => (
				<FilledListItem {...team} key={team.teamId} userId={userId} />
			))}
		</ItemGroup>
	);
}

export { TeamMembershipsForUserList };
