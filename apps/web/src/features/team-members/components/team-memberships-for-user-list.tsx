import { Link } from "@tanstack/react-router";
import { MoreVerticalIcon, UsersIcon } from "lucide-react";
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
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

import { NoTeamMembershipsPlaceholder } from "./no-team-memberships-placeholder";

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

function TeamMembershipsForUserList({
	teams,
	userId,
}: Params & { teams: Array<Team> }) {
	if (teams.length === 0) {
		return <NoTeamMembershipsPlaceholder userId={userId} />;
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
