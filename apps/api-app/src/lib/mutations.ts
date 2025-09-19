import { invariant } from "@turborepo-remote-cache/core";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import {
	apiKey,
	artifact,
	artifactTeam,
} from "@turborepo-remote-cache/db/schema";
import * as R from "remeda";

export async function touchApiKeyForToken(token: string) {
	await db
		.update(apiKey)
		.set({ lastUsedAt: new Date() })
		.where(eq(apiKey.secret, token));
}

type CreateArtifactInput = {
	hash: string;
	teamId: string;
};

export async function createArtifact({ hash, teamId }: CreateArtifactInput) {
	const upsertedArtifact = await db
		.insert(artifact)
		.values({ hash })
		.onConflictDoUpdate({ target: artifact.hash, set: { hash } })
		.returning({ id: artifact.id })
		.then(R.first());

	invariant(upsertedArtifact, "Failed to upsert artifact");

	await db
		.insert(artifactTeam)
		.values({ artifactId: upsertedArtifact.id, teamId })
		.onConflictDoNothing();
}
