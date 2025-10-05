import { Link } from "@tanstack/react-router";
import { MoreVerticalIcon } from "lucide-react";
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
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { getAvatarFallback } from "@/features/users/utils";

const { DetachTeamMemberFromTeamAlertDialog } = lazily(
	() => import("./detach-team-member-from-team-alert-dialog"),
);

type Props = {
	email: string;
	image: null | string;
	name: string;
	teamId: string;
	userId: string;
};

function TeamMemberItem({ name, userId, image, teamId }: Props) {
	return (
		<Item variant="outline">
			<ItemMedia>
				<Avatar className="size-10">
					{image && <AvatarImage src={image} alt={name} />}
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

export { TeamMemberItem };
