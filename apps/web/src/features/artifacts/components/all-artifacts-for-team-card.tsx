import { invariant } from "@remote-cache/core";
import { eq } from "@remote-cache/db";
import { artifact, artifactTeam, team } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, count, ilike, or, SQL } from "drizzle-orm";
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
import { IdSchema, LimitSchema, PageSchema, QuerySchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { ArtifactsForTeamTable } from "./artifacts-for-team-table";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
	query: QuerySchema.optional(),
	page: PageSchema.optional().default(1),
	limit: LimitSchema.optional().default(10),
});

const getAllArtifactsForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { teamId, query, limit, page } }) => {
		const filters: Array<SQL | undefined> = [];

		filters.push(eq(team.id, teamId));

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
			.innerJoin(artifactTeam, eq(artifact.id, artifactTeam.artifactId))
			.innerJoin(team, eq(artifactTeam.teamId, team.id))
			.where(and(...filters))
			.limit(limit)
			.offset((page - 1) * limit);

		const countQuery = db
			.select({ count: count() })
			.from(artifact)
			.innerJoin(artifactTeam, eq(artifact.id, artifactTeam.artifactId))
			.innerJoin(team, eq(artifactTeam.teamId, team.id))
			.where(and(...filters))
			.then((res) => {
				const [count] = res;

				invariant(count, "Count query should return a result");

				return count.count;
			});

		const [data, countResult] = await Promise.all([artifactQuery, countQuery]);

		const pagination = {
			page,
			limit,
			totalPages: Math.ceil(countResult / limit),
			totalItems: countResult,
		};

		return {
			data,
			pagination,
		};
	});

function allArtifactsForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllArtifactsForTeam({ data: params }),
		queryKey: [
			ARTIFACTS_QUERY_KEY,
			"all-artifacts-for-team",
			params.teamId,
			params.query,
			params.page,
			params.limit,
		],
	});
}

function AllArtifactsForTeamCard({ teamId }: Params) {
	const search = useSearch({
		strict: false,
		select: (state) => ({
			query: state.query,
			page: state.page,
			limit: state.limit,
		}),
	});

	const query = useSuspenseQuery(
		allArtifactsForTeamQueryOptions({ teamId, ...search }),
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Team Artifacts</CardTitle>
						<CardDescription>
							Artifacts associated with this team
						</CardDescription>
					</div>
					<SearchForm placeholder="Search artifacts..." />
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<ArtifactsForTeamTable artifacts={query.data.data} />
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

AllArtifactsForTeamCard.queryOptions = allArtifactsForTeamQueryOptions;

export { AllArtifactsForTeamCard };
