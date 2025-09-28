import { desc, eq, ilike, inArray, or, SQL } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { artifact, artifactTeam, team } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as R from "remeda";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { QuerySchema } from "../schemas";
import { ArtifactsTable } from "./artifacts-table";
import { SearchArtifactsForm } from "./search-artifacts-form";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	query: QuerySchema.optional(),
});

const getAllArtifacts = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { query } }) => {
		const filters: Array<SQL> = [];

		if (query) {
			filters.push(ilike(artifact.hash, `%${query}%`));
		}

		const artifacts = await db
			.select({
				artifactId: artifact.id,
				hash: artifact.hash,
				createdAt: artifact.createdAt,
			})
			.from(artifact)
			.where(or(...filters))
			.orderBy(desc(artifact.createdAt));

		const artifactTeamCollection = await db
			.selectDistinct({
				artifactId: artifact.id,
				teamId: team.id,
				name: team.name,
				slug: team.slug,
			})
			.from(team)
			.innerJoin(artifactTeam, eq(team.id, artifactTeam.teamId))
			.innerJoin(artifact, eq(artifactTeam.artifactId, artifact.id))
			.where(inArray(artifact.id, artifacts.map(R.prop("artifactId"))));

		return artifacts.map((artifact) => {
			const teams = artifactTeamCollection.filter(
				(team) => team.artifactId === artifact.artifactId,
			);

			return { ...artifact, teams };
		});
	});

function allArtifactsQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllArtifacts({ data: params }),
		queryKey: [ARTIFACTS_QUERY_KEY, "all-artifacts", params.query],
	});
}

function AllArtifactsCard({
	query,
	onSearch,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const { data: artifacts } = useSuspenseQuery(
		allArtifactsQueryOptions({ query }),
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">All Artifacts</CardTitle>
						<CardDescription>
							A list of all artifacts in the system and their attached teams
						</CardDescription>
					</div>

					<SearchArtifactsForm query={query} onSearch={onSearch} />
				</div>
			</CardHeader>
			<CardContent>
				<ArtifactsTable artifacts={artifacts} />
			</CardContent>
		</Card>
	);
}

AllArtifactsCard.queryOptions = allArtifactsQueryOptions;

export { AllArtifactsCard };
