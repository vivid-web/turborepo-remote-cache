import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authMiddleware } from "@/middlewares/auth-middleware";

const fetchUsers = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => {
		return await db.query.user.findMany({
			columns: {
				id: true,
				name: true,
				image: true,
				email: true,
			},
		});
	});

function usersQueryOptions() {
	return queryOptions({
		queryFn: async () => fetchUsers(),
		queryKey: ["users"],
	});
}

export const Route = createFileRoute("/_authenticated/users/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(usersQueryOptions());
	},
});

function UsersTable() {
	const usersQuery = useSuspenseQuery(usersQueryOptions());

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						<TableHead className="w-[100px]">User email</TableHead>
						<TableHead>User name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{usersQuery.data.map((user) => (
						<TableRow key={user.id}>
							<TableCell className="font-medium">
								<Link to="/users/$userId" params={{ userId: user.id }}>
									{user.email}
								</Link>
							</TableCell>
							<TableCell>{user.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function RouteComponent() {
	return <UsersTable />;
}
