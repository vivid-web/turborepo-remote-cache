import { Link } from "@tanstack/react-router";
import { MoreVerticalIcon, UsersIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DetachTeamMemberFromUserAlertDialog } from "./detach-team-member-from-user-alert-dialog";

type Params = {
	userId: string;
};

type Team = {
	name: string;
	teamId: string;
};

function FilledListItem({ name, teamId, userId }: Params & Team) {
	return (
		<div className="bg-card flex items-center justify-between rounded-lg border p-3">
			<div className="flex items-center gap-3">
				<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
					<UsersIcon className="text-primary h-4 w-4" />
				</div>
				<div>
					<p className="text-sm font-medium">{name}</p>
					<p className="text-muted-foreground text-xs">Member</p>
				</div>
			</div>
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
					<DetachTeamMemberFromUserAlertDialog teamId={teamId} userId={userId}>
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
		</div>
	);
}

function EmptyListItem() {
	return (
		<div className="bg-card flex items-center justify-between rounded-lg border border-dashed p-3">
			<div className="flex items-center gap-3">
				<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
					<UsersIcon className="text-primary h-4 w-4" />
				</div>
				<div>
					<p className="text-sm font-medium">No teams found</p>
					<p className="text-muted-foreground text-xs">
						This user is not a member of any teams
					</p>
				</div>
			</div>
		</div>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return <div className="grid gap-2">{children}</div>;
}

function TeamMembershipsForUserList({
	teams,
	userId,
}: Params & { teams: Array<Team> }) {
	if (teams.length === 0) {
		return (
			<Layout>
				<EmptyListItem />
			</Layout>
		);
	}

	return (
		<Layout>
			{teams.map((team) => (
				<FilledListItem {...team} key={team.teamId} userId={userId} />
			))}
		</Layout>
	);
}

export { TeamMembershipsForUserList };
