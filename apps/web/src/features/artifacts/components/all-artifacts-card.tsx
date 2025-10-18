import { and, desc, eq, ilike, inArray, or, SQL } from "@remote-cache/db";
import { artifact, artifactTeam, team } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useNavigate, useSearch } from "@tanstack/react-router";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/db";
import { PaginationSchema } from "@/lib/pagination";
import { withPagination } from "@/lib/pagination.server";
import { auth } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";
import { QuerySchema } from "../schemas";
import { ArtifactsTable } from "./artifacts-table";
import { SearchArtifactsForm } from "./search-artifacts-form";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = PaginationSchema.extend({
	query: QuerySchema.optional(),
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
			.$dynamic();

		const [artifacts, pagination] = await withPagination(artifactQuery, {
			limit,
			page,
		});

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

function AllArtifactsCard({
	page,
	limit,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const routeApi = getRouteApi<T>(routeId);
	const navigate = useNavigate();
	const search = routeApi.useSearch({ from: "." });

	const { data: artifacts } = useSuspenseQuery(
		allArtifactsQueryOptions({ query, page, limit }),
	);

	const handleSearch = async (query?: string) => {
		await navigate({
			search: (curr) => ({ ...curr, query }),
		});
	};

	const handleLimitChange = async (value: string) => {
		await navigate({
			search: (curr) => ({ ...curr, limit: Number(value) }),
		});
	};

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
					<div className="flex shrink-0 items-center gap-2">
						<Label>Results per page</Label>
						<Select defaultValue="10" onValueChange={handleLimitChange}>
							<SelectTrigger className="w-fit whitespace-nowrap">
								<SelectValue placeholder="Select number of results" />
							</SelectTrigger>
							<SelectContent className="[&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto">
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Pagination {...artifacts.pagination} />
				</div>
			</CardContent>
		</Card>
	);
}

AllArtifactsCard.queryOptions = allArtifactsQueryOptions;

export { AllArtifactsCard };
