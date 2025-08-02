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
import { DetachTeamFromUserAlertDialog } from "@/features/teams/components/detach-team-from-user-alert-dialog";

type Params = {
	userId: string;
};

type Team = {
	name: string;
	teamId: string;
};

function FilledListItem({ name, teamId, userId }: Params & Team) {
	return (
		<div className="flex items-center justify-between rounded-lg border bg-card p-3">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
					<UsersIcon className="h-4 w-4 text-primary" />
				</div>
				<div>
					<p className="text-sm font-medium">{name}</p>
					<p className="text-xs text-muted-foreground">Member</p>
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
							View Details
						</Link>
					</DropdownMenuItem>
					<DetachTeamFromUserAlertDialog teamId={teamId} userId={userId}>
						<DropdownMenuItem
							className="text-destructive"
							onSelect={(e) => {
								e.preventDefault();
							}}
						>
							Detach Team
						</DropdownMenuItem>
					</DetachTeamFromUserAlertDialog>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function EmptyListItem() {
	return (
		<div className="flex items-center justify-between rounded-lg border border-dashed bg-card p-3">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
					<UsersIcon className="h-4 w-4 text-primary" />
				</div>
				<div>
					<p className="text-sm font-medium">No teams found</p>
					<p className="text-xs text-muted-foreground">
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

function TeamsForUserList({ teams, userId }: Params & { teams: Array<Team> }) {
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

export { TeamsForUserList };
