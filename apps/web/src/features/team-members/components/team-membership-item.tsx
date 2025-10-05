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
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

const { DetachTeamMemberFromUserAlertDialog } = lazily(
	() => import("./detach-team-member-from-user-alert-dialog"),
);

type Props = {
	name: string;
	teamId: string;
	userId: string;
};

function TeamMembershipItem({ name, teamId, userId }: Props) {
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

export { TeamMembershipItem };
