import { invariant } from "@remote-cache/core";
import { and, desc, eq, ilike, inArray, or, SQL } from "@remote-cache/db";
import { artifact, artifactTeam, team } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";
import * as R from "remeda";
import { z } from "zod";

import { LimitSelect } from "@/components/limit-select";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { LimitSchema, PageSchema, QuerySchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { ArtifactsTable } from "./artifacts-table";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	query: QuerySchema.optional(),
	page: PageSchema.optional().default(1),
	limit: LimitSchema.optional().default(10),
});

const getAllArtifacts = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { query, limit, page } }) => {
		const filters: Array<SQL | undefined> = [];

		if (query) {
			filters.push(or(ilike(artifact.hash, `%${query}%`)));
		}

		const artifactQuery = db
			.select({
				artifactId: artifact.id,
				hash: artifact.hash,
				createdAt: artifact.createdAt,
			})
			.from(artifact)
			.where(and(...filters))
			.orderBy(desc(artifact.createdAt))
			.limit(limit)
			.offset((page - 1) * limit);

		const countQuery = db
			.select({ count: count() })
			.from(artifact)
			.where(and(...filters))
			.then((res) => {
				const [count] = res;

				invariant(count, "Count query should return a result");

				return count.count;
			});

		const [artifacts, countResult] = await Promise.all([
			artifactQuery,
			countQuery,
		]);

		const pagination = {
			page,
			limit,
			totalPages: Math.ceil(countResult / limit),
			totalItems: countResult,
		};

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

		const data = artifacts.map((artifact) => {
			const teams = artifactTeamCollection.filter(
				(team) => team.artifactId === artifact.artifactId,
			);

			return { ...artifact, teams };
		});

		return {
			data,
			pagination,
		};
	});

function allArtifactsQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllArtifacts({ data: params }),
		queryKey: [
			ARTIFACTS_QUERY_KEY,
			"all-artifacts",
			params.query,
			params.page,
			params.limit,
		],
	});
}

function AllArtifactsCard() {
	const search = useSearch({
		strict: false,
		select: (state) => ({
			query: state.query,
			page: state.page,
			limit: state.limit,
		}),
	});

	const query = useSuspenseQuery(allArtifactsQueryOptions(search));

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
					<SearchForm placeholder="Search artifacts..." />
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<ArtifactsTable artifacts={query.data.data} />
				<div className="flex flex-1 flex-row justify-between">
					<LimitSelect />
					{query.data.pagination.totalPages > 1 && (
						<Pagination {...query.data.pagination} />
					)}
				</div>
			</CardContent>
		</Card>
	);
}

AllArtifactsCard.queryOptions = allArtifactsQueryOptions;

export { AllArtifactsCard };
