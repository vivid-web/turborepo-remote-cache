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

import { EditUserDialog } from "./edit-user-dialog";
import { RemoveUserAlertDialog } from "./remove-user-alert-dialog";

type User = {
	email: string;
	id: string;
	image: null | string;
	name: string;
};

function getAvatarFallback(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("");
}

function FilledRow(user: User) {
	const { image, name, email } = user;

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
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<EditUserDialog {...user}>
							<DropdownMenuItem
								onSelect={(e) => {
									e.preventDefault();
								}}
							>
								Edit User
							</DropdownMenuItem>
						</EditUserDialog>
						<RemoveUserAlertDialog {...user}>
							<DropdownMenuItem
								className="text-destructive"
								onSelect={(e) => {
									e.preventDefault();
								}}
							>
								Remove User
							</DropdownMenuItem>
						</RemoveUserAlertDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={2}>No users found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>User</TableHead>
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
				<FilledRow {...user} key={user.id} />
			))}
		</Layout>
	);
}

export { UsersTable };
