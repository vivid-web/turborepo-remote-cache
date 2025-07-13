import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

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
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell>No users found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>User</TableHead>
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
