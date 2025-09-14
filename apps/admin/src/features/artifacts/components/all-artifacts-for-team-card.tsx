import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import {
	artifact,
	artifactTeam,
	team,
} from "@turborepo-remote-cache/db/schema";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { ArtifactsForTeamTable } from "./artifacts-for-team-table";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
});

const getAllArtifactsForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		return db
			.select({
				artifactId: artifact.id,
				hash: artifact.hash,
				createdAt: artifact.createdAt,
			})
			.from(artifact)
			.innerJoin(artifactTeam, eq(artifact.id, artifactTeam.artifactId))
			.innerJoin(team, eq(artifactTeam.teamId, team.id))
			.where(eq(team.id, teamId));
	});

function allArtifactsForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllArtifactsForTeam({ data: params }),
		queryKey: [ARTIFACTS_QUERY_KEY, "all-artifacts-for-team", params.teamId],
	});
}

function AllArtifactsForTeamCard({ teamId }: Params) {
	const query = useSuspenseQuery(allArtifactsForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Team Artifacts</CardTitle>
				<CardDescription>Artifacts associated with this team</CardDescription>
			</CardHeader>
			<CardContent>
				<ArtifactsForTeamTable artifacts={query.data} />
			</CardContent>
		</Card>
	);
}

AllArtifactsForTeamCard.queryOptions = allArtifactsForTeamQueryOptions;

export { AllArtifactsForTeamCard };
