import { Link } from "@tanstack/react-router";
import { MoreHorizontalIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getAvatarFallback } from "@/features/users/utils";

import { formatCreatedDate } from "../utils";
import { EditTeamDialog } from "./edit-team-dialog";
import { RemoveTeamAlertDialog } from "./remove-team-alert-dialog";

type Member = {
	email: string;
	image: null | string;
	name: string;
	userId: string;
};

type Team = {
	createdAt: Date;
	members: Array<Member>;
	name: string;
	teamId: string;
};

function TeamMemberAvatar({ image, name }: Member) {
	return (
		<Avatar className="h-8 w-8 border-2 border-background">
			{image && <AvatarImage src={image} />}
			<AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
		</Avatar>
	);
}

function TeamMembersContent({
	members,
	cutoff = 4,
}: {
	cutoff?: number;
	members: Array<Member>;
}) {
	return (
		<div className="flex -space-x-2">
			{members.slice(0, cutoff).map((member) => (
				<TeamMemberAvatar {...member} key={member.userId} />
			))}

			{members.length > cutoff && (
				<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
					+{members.length - cutoff}
				</div>
			)}
		</div>
	);
}

function FilledRow({ name, teamId, createdAt, members }: Team) {
	return (
		<TableRow>
			<TableCell>
				<div className="flex flex-col space-x-3">
					<div className="font-medium">{name}</div>
					<div className="text-sm text-muted-foreground">ID: {teamId}</div>
				</div>
			</TableCell>
			<TableCell>
				<TeamMembersContent members={members} />
			</TableCell>
			<TableCell className="text-muted-foreground">
				{formatCreatedDate(createdAt)}
			</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link to="/teams/$teamId" params={{ teamId }}>
								View
							</Link>
						</DropdownMenuItem>
						<React.Suspense
							fallback={<DropdownMenuItem>Edit</DropdownMenuItem>}
						>
							<EditTeamDialog teamId={teamId}>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									Edit
								</DropdownMenuItem>
							</EditTeamDialog>
						</React.Suspense>
						<RemoveTeamAlertDialog teamId={teamId}>
							<DropdownMenuItem
								variant="destructive"
								onSelect={(e) => {
									e.preventDefault();
								}}
							>
								Delete
							</DropdownMenuItem>
						</RemoveTeamAlertDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={4}>No teams found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Team</TableHead>
					<TableHead>Members</TableHead>
					<TableHead>Created</TableHead>
					<TableHead className="w-[50px]"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{children}</TableBody>
		</Table>
	);
}

function TeamsTable({ teams }: { teams: Array<Team> }) {
	if (teams.length === 0) {
		return (
			<Layout>
				<EmptyRow />
			</Layout>
		);
	}

	return (
		<Layout>
			{teams.map((team) => (
				<FilledRow {...team} key={team.teamId} />
			))}
		</Layout>
	);
}

export { TeamsTable };
