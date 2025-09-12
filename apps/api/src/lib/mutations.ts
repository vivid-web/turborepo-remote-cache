import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { apiKey, artifact } from "@turborepo-remote-cache/db/schema";

export async function touchApiKeyForToken(token: string) {
	await db
		.update(apiKey)
		.set({ lastUsedAt: new Date() })
		.where(eq(apiKey.secret, token));
}

export async function createOrUpdateArtifact(input: {
	hash: string;
	teamId: string;
}) {
	await db.insert(artifact).values(input).onConflictDoNothing();
}
