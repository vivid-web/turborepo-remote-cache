import { Link } from "@tanstack/react-router";
import { Loader2Icon, MoreHorizontalIcon } from "lucide-react";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCreatedDate } from "@/features/artifacts/utils";

import { formatLastLoginDate, getAvatarFallback } from "../utils";

const { EditUserDialog } = lazily(() => import("./edit-user-dialog"));

const { RemoveUserAlertDialog } = lazily(
	() => import("./remove-user-alert-dialog"),
);

type User = {
	createdAt: Date;
	email: string;
	image: null | string;
	lastLoggedInAt: Date | null;
	name: string;
	userId: string;
};

function FilledRow({
	image,
	name,
	email,
	userId,
	createdAt,
	lastLoggedInAt,
}: User) {
	return (
		<TableRow>
			<TableCell>
				<div className="flex items-center space-x-3">
					<Avatar className="h-8 w-8">
						{image && <AvatarImage src={image} alt={name} />}
						<AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">{name}</div>
						<div className="text-sm text-muted-foreground">{email}</div>
					</div>
				</div>
			</TableCell>
			<TableCell className="text-muted-foreground">
				{formatCreatedDate(createdAt)}
			</TableCell>
			<TableCell>{formatLastLoginDate(lastLoggedInAt)}</TableCell>
			<TableCell>
				<React.Suspense
					fallback={
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" disabled>
									<Loader2Icon className="h-4 w-4 animate-spin" />
								</Button>
							</DropdownMenuTrigger>
						</DropdownMenu>
					}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm">
								<MoreHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link to="/users/$userId" params={{ userId }}>
									View
								</Link>
							</DropdownMenuItem>
							<EditUserDialog userId={userId}>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									Edit
								</DropdownMenuItem>
							</EditUserDialog>
							<RemoveUserAlertDialog userId={userId}>
								<DropdownMenuItem
									variant="destructive"
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									Delete
								</DropdownMenuItem>
							</RemoveUserAlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</React.Suspense>
			</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={4}>No users found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>User</TableHead>
					<TableHead>Joined</TableHead>
					<TableHead>Last Active</TableHead>
					<TableHead className="w-[50px]"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{children}</TableBody>
		</Table>
	);
}

function UsersTable({ users }: { users: Array<User> }) {
	if (users.length === 0) {
		return (
			<Layout>
				<EmptyRow />
			</Layout>
		);
	}

	return (
		<Layout>
			{users.map((user) => (
				<FilledRow {...user} key={user.userId} />
			))}
		</Layout>
	);
}

export { UsersTable };
