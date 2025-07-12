import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authMiddleware } from "@/middlewares/auth-middleware";

import { db } from "../../../drizzle/db";

const fetchArtifacts = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => {
		return await db.query.artifact.findMany({
			columns: {
				id: true,
			},
		});
	});

function artifactsQueryOptions() {
	return queryOptions({
		queryFn: async () => fetchArtifacts(),
		queryKey: ["artifacts"],
	});
}

export const Route = createFileRoute("/_authenticated/artifacts/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(artifactsQueryOptions());
	},
});

function ArtifactsTable() {
	const artifactsQuery = useSuspenseQuery(artifactsQueryOptions());

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						<TableHead className="w-[100px]">Artifact ID</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{artifactsQuery.data.map((artifact) => (
						<TableRow key={artifact.id}>
							<TableCell className="font-medium">
								<Link
									to="/artifacts/$artifactId"
									params={{ artifactId: artifact.id }}
								>
									{artifact.id}
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
	return <ArtifactsTable />;
}
