import { Link } from "@tanstack/react-router";
import { MoreVerticalIcon, SquarePlusIcon, UserIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getAvatarFallback } from "@/features/users/utils";

const { AttachTeamMembersToTeamDialog } = lazily(
	() => import("./attach-team-members-to-team-dialog"),
);

const { DetachTeamMemberFromTeamAlertDialog } = lazily(
	() => import("./detach-team-member-from-team-alert-dialog"),
);

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
		<Item variant="outline">
			<ItemMedia>
				<Avatar className="size-10">
					{image && (
						<AvatarImage src="https://github.com/evilrabbit.png" alt={name} />
					)}
					<AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
				</Avatar>
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
								<Link to="/users/$userId" params={{ userId }}>
									View
								</Link>
							</DropdownMenuItem>
							<DetachTeamMemberFromTeamAlertDialog
								userId={userId}
								teamId={teamId}
							>
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
				</React.Suspense>
			</ItemActions>
		</Item>
	);
}

function EmptyListItem({ teamId }: Params) {
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

function TeamMembersForTeamList({
	users,
	teamId,
}: Params & { users: Array<User> }) {
	if (!users.length) {
		return <EmptyListItem teamId={teamId} />;
	}

	return (
		<ItemGroup className="gap-4">
			{users.map((user) => (
				<FilledListItem {...user} teamId={teamId} key={user.userId} />
			))}
		</ItemGroup>
	);
}

export { TeamMembersForTeamList };
