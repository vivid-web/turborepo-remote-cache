import type { Database } from "@remote-cache/db";

import { invariant } from "@remote-cache/core";
import { eq } from "@remote-cache/db";
import { apiKey, artifact, artifactTeam } from "@remote-cache/db/schema";
import * as R from "remeda";

export function touchApiKeyForToken(database: Database) {
	return async (token: string) => {
		await database
			.update(apiKey)
			.set({ lastUsedAt: new Date() })
			.where(eq(apiKey.secret, token));
	};
}

type CreateArtifactInput = {
	hash: string;
	teamId: string;
};

export function createArtifact(db: Database) {
	return async ({ hash, teamId }: CreateArtifactInput) => {
		const upsertedArtifact = await db
			.insert(artifact)
			.values({ hash })
			.onConflictDoUpdate({ target: artifact.hash, set: { hash } })
			// @ts-expect-error figure out why this is failing
			.returning({ id: artifact.id })
			.then(R.first());

		invariant(upsertedArtifact, "Failed to upsert artifact");

		await db
			.insert(artifactTeam)
			.values({ artifactId: upsertedArtifact.id, teamId })
			.onConflictDoNothing();
	};
}
