import { Link } from "@tanstack/react-router";
import { MoreHorizontalIcon } from "lucide-react";
import * as React from "react";

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

import { formatCreatedDate } from "../utils";
import { EditTeamDialog } from "./edit-team-dialog";
import { RemoveTeamAlertDialog } from "./remove-team-alert-dialog";

type Team = {
	createdAt: Date;
	memberCount: number;
	name: string;
	teamId: string;
};

function FilledRow({ name, teamId, memberCount, createdAt }: Team) {
	return (
		<TableRow>
			<TableCell>
				<div className="flex flex-col space-x-3">
					<div className="font-medium">{name}</div>
					<div className="text-sm text-muted-foreground">ID: {teamId}</div>
				</div>
			</TableCell>
			<TableCell>
				<div className="font-medium">{memberCount}</div>
				<div className="text-sm text-muted-foreground">members</div>
			</TableCell>
			<TableCell>{formatCreatedDate(createdAt)}</TableCell>
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
								View Details
							</Link>
						</DropdownMenuItem>
						<React.Suspense
							fallback={<DropdownMenuItem disabled>Edit Team</DropdownMenuItem>}
						>
							<EditTeamDialog teamId={teamId}>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									Edit Team
								</DropdownMenuItem>
							</EditTeamDialog>
						</React.Suspense>
						<RemoveTeamAlertDialog teamId={teamId}>
							<DropdownMenuItem
								className="text-destructive"
								onSelect={(e) => {
									e.preventDefault();
								}}
							>
								Remove Team
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
