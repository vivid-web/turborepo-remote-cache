import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { artifact } from "@turborepo-remote-cache/db/schema";
import { PackageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authMiddleware } from "@/middlewares/auth";

import { ARTIFACTS_QUERY_KEY } from "../constants";

const getTotalArtifacts = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => db.$count(artifact));

function totalArtifactsQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalArtifacts(),
		queryKey: [ARTIFACTS_QUERY_KEY, "total-artifacts"],
	});
}

function TotalArtifactsCard() {
	const query = useSuspenseQuery(totalArtifactsQueryOptions());

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
				<p className="text-xs text-muted-foreground">
					Artifacts uploaded in the system
				</p>
			</CardContent>
		</Card>
	);
}

TotalArtifactsCard.queryOptions = totalArtifactsQueryOptions;

export { TotalArtifactsCard };
