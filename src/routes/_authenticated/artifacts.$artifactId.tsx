import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { db } from "../../../drizzle/db";

const ArtifactIdSchema = z.string().min(1);

const fetchArtifact = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((artifactId: unknown) => ArtifactIdSchema.parse(artifactId))
	.handler(async ({ data: artifactId }) => {
		const artifact = await db.query.artifact.findFirst({
			where: (artifact, { eq }) => eq(artifact.id, artifactId),
			columns: {
				id: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!artifact) {
			throw notFound();
		}

		return artifact;
	});

function artifactQueryOptions(artifactId: string) {
	return queryOptions({
		queryFn: async () => fetchArtifact({ data: artifactId }),
		queryKey: ["artifacts", artifactId],
	});
}

export const Route = createFileRoute("/_authenticated/artifacts/$artifactId")({
	component: RouteComponent,
	params: {
		parse: (params) => ({
			artifactId: ArtifactIdSchema.parse(params.artifactId),
		}),
	},
	loader: async ({ context, params: { artifactId } }) => {
		const artifact = await context.queryClient.ensureQueryData(
			artifactQueryOptions(artifactId),
		);

		return {
			crumb: artifact.id,
		};
	},
});

function RouteComponent() {
	const { artifactId } = Route.useParams();

	const artifactQuery = useSuspenseQuery(artifactQueryOptions(artifactId));

	return <pre>{JSON.stringify(artifactQuery.data, null, 2)}</pre>;
}
