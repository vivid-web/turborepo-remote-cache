import { Link } from "@tanstack/react-router";
import { MoreVerticalIcon, UserIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarFallback } from "@/features/users/utils";

import { DetachTeamMemberFromTeamAlertDialog } from "./detach-team-member-from-team-alert-dialog";

type Params = {
	teamId: string;
};

type User = {
	email: string;
	image: null | string;
	name: string;
	userId: string;
};

function FilledListItem({ name, userId, image, teamId }: Params & User) {
	return (
		<div className="bg-card flex items-center justify-between rounded-lg border p-3">
			<div className="flex items-center gap-3">
				<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
					<Avatar className="h-8 w-8">
						{image && <AvatarImage src={image} alt={name} />}
						<AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
					</Avatar>
					<UserIcon className="text-primary h-4 w-4" />
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
						<Link to="/users/$userId" params={{ userId }}>
							View
						</Link>
					</DropdownMenuItem>
					<DetachTeamMemberFromTeamAlertDialog userId={userId} teamId={teamId}>
						<DropdownMenuItem
							className="text-destructive"
							onSelect={(e) => {
								e.preventDefault();
							}}
						>
							Detach
						</DropdownMenuItem>
					</DetachTeamMemberFromTeamAlertDialog>
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
					<UserIcon className="text-primary h-4 w-4" />
				</div>
				<div>
					<p className="text-sm font-medium">No team members found</p>
					<p className="text-muted-foreground text-xs">
						This team does not have any team members
					</p>
				</div>
			</div>
		</div>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return <div className="grid gap-2">{children}</div>;
}

function TeamMembersForTeamList({
	users,
	teamId,
}: Params & { users: Array<User> }) {
	if (!users.length) {
		return (
			<Layout>
				<EmptyListItem />
			</Layout>
		);
	}

	return (
		<Layout>
			{users.map((user) => (
				<FilledListItem {...user} teamId={teamId} key={user.userId} />
			))}
		</Layout>
	);
}

export { TeamMembersForTeamList };
