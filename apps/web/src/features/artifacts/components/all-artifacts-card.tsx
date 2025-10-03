import { invariant } from "@remote-cache/core";
import {
	and,
	count,
	desc,
	eq,
	ilike,
	inArray,
	or,
	SQL,
} from "@remote-cache/db";
import { artifact, artifactTeam, team } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as R from "remeda";
import { z } from "zod";

import { Pagination } from "@/components/pagination";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/db";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { PageSchema, PageSizeSchema, QuerySchema } from "../schemas";
import { ArtifactsTable } from "./artifacts-table";
import { SearchArtifactsForm } from "./search-artifacts-form";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	query: QuerySchema.optional(),
	page: PageSchema.optional().default(1),
	limit: PageSizeSchema.optional().default(10),
});

const getAllArtifacts = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { query, limit, page } }) => {
		const filters: Array<SQL | undefined> = [];

		if (query) {
			filters.push(or(ilike(artifact.hash, `%${query}%`)));
		}

		const offset = (page - 1) * limit;

		const artifacts = await db
			.select({
				artifactId: artifact.id,
				hash: artifact.hash,
				createdAt: artifact.createdAt,
			})
			.from(artifact)
			.where(and(...filters))
			.orderBy(desc(artifact.createdAt))
			.limit(limit)
			.offset(offset);

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

		const totalArtifactResult = await db
			.select({ totalArtifacts: count() })
			.from(artifact)
			.where(and(...filters))
			.then(R.first());

		invariant(totalArtifactResult, "Count query should return a result");

		const { totalArtifacts } = totalArtifactResult;

		const data = artifacts.map((artifact) => {
			const teams = artifactTeamCollection.filter(
				(team) => team.artifactId === artifact.artifactId,
			);

			return { ...artifact, teams };
		});

		const pagination = {
			page,
			limit,
			totalPages: Math.ceil(totalArtifacts / limit),
			totalItems: totalArtifacts,
		};

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

function AllArtifactsCard({
	query,
	page,
	limit,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const { data: artifacts } = useSuspenseQuery(
		allArtifactsQueryOptions({ query, page, limit }),
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

					<SearchArtifactsForm routeId="/_authenticated/artifacts/" />
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<ArtifactsTable artifacts={artifacts.data} />
				<div className="flex flex-1 flex-row justify-between">
					<Select>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Number of items" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="25">25</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>
					<Pagination {...artifacts.pagination} className="mx-0 flex w-auto" />
				</div>
			</CardContent>
		</Card>
	);
}

AllArtifactsCard.queryOptions = allArtifactsQueryOptions;

export { AllArtifactsCard };
