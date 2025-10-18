import { desc, eq, ilike, inArray, or, SQL } from "@remote-cache/db";
import { artifact, artifactTeam, team } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as R from "remeda";
import { z } from "zod";

import { SearchForm } from "@/components/search-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { QuerySchema } from "../schemas";
import { ArtifactsTable } from "./artifacts-table";

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

const routeApi = getRouteApi("/_authenticated/artifacts/");

function AllArtifactsCard() {
	const query = routeApi.useSearch({
		select: (state) => state.query,
	});

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
					<SearchForm
						routeId="/_authenticated/artifacts/"
						placeholder="Search artifacts..."
					/>
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
