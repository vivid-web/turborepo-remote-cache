import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import {
	artifact,
	artifactTeam,
	team,
} from "@turborepo-remote-cache/db/schema";
import { PackageIcon } from "lucide-react";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
});

const getTotalArtifactsForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		const [item] = await db
			.select({ count: count() })
			.from(artifact)
			.innerJoin(artifactTeam, eq(artifact.id, artifactTeam.artifactId))
			.innerJoin(team, eq(artifactTeam.teamId, team.id))
			.where(eq(team.id, teamId));

		if (!item) {
			throw notFound();
		}

		return item.count;
	});

function totalArtifactsForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getTotalArtifactsForTeam({ data: params }),
		queryKey: [ARTIFACTS_QUERY_KEY, "total-artifacts-for-team", params.teamId],
	});
}

function TotalArtifactsForTeamCard({ teamId }: Params) {
	const query = useSuspenseQuery(totalArtifactsForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex items-center gap-2">
					<PackageIcon className="!h-4 !w-4" />
					<CardTitle className="font-medium">Total Artifacts</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Artifacts for this team</p>
			</CardContent>
		</Card>
	);
}

TotalArtifactsForTeamCard.queryOptions = totalArtifactsForTeamQueryOptions;

export { TotalArtifactsForTeamCard };
