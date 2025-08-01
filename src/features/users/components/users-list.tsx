import { Link } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { getAvatarFallback } from "../utils";

type User = {
	email: string;
	image: null | string;
	name: string;
	userId: string;
};

function FilledListItem({ name, userId, image }: User) {
	return (
		<div className="flex items-center justify-between rounded-lg border bg-card p-3">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
					<Avatar className="h-8 w-8">
						{image && <AvatarImage src={image} alt={name} />}
						<AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
					</Avatar>
					<UserIcon className="h-4 w-4 text-primary" />
				</div>
				<div>
					<p className="text-sm font-medium">{name}</p>
					<p className="text-xs text-muted-foreground">Member</p>
				</div>
			</div>
			<Button variant="outline" size="sm" asChild>
				<Link to="/users/$userId" params={{ userId }}>
					View User
				</Link>
			</Button>
		</div>
	);
}

function EmptyListItem() {
	return (
		<div className="flex items-center justify-between rounded-lg border border-dashed bg-card p-3">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
					<UserIcon className="h-4 w-4 text-primary" />
				</div>
				<div>
					<p className="text-sm font-medium">No team members found</p>
					<p className="text-xs text-muted-foreground">
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

function UsersList({ users }: { users: Array<User> }) {
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
				<FilledListItem {...user} key={user.userId} />
			))}
		</Layout>
	);
}

export { UsersList };
