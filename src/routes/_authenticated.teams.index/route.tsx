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
import { auth } from "@/middlewares/auth";

const fetchTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => {
		return await db.query.team.findMany({
			columns: {
				id: true,
				name: true,
			},
		});
	});

function teamsQueryOptions() {
	return queryOptions({
		queryFn: async () => fetchTeams(),
		queryKey: ["teams"],
	});
}

export const Route = createFileRoute("/_authenticated/teams/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(teamsQueryOptions());
	},
});

function TeamsTable() {
	const teamsQuery = useSuspenseQuery(teamsQueryOptions());

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						<TableHead className="w-[100px]">Team name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teamsQuery.data.map((team) => (
						<TableRow key={team.id}>
							<TableCell className="font-medium">
								<Link to="/teams/$teamId" params={{ teamId: team.id }}>
									{team.name}
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function RouteComponent() {
	return <TeamsTable />;
}
