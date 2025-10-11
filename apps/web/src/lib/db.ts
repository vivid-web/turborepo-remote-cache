import type { Client } from "@remote-cache/db";

import {
	createClient as createLocalClient,
	createDatabase as createLocalDatabase,
	type Client as LocalClient,
} from "@remote-cache/db/providers/local";
import {
	createClient as createNetlifyNeonClient,
	createDatabase as createNetlifyNeonDatabase,
	type Client as NetlifyNeonClient,
} from "@remote-cache/db/providers/netlify-neon";

import { env } from "@/env.server";

function isLocalClient(client: Client): client is LocalClient {
	return env.DATABASE_PROVIDER === "local";
}

function isNetlifyNeonClient(client: Client): client is NetlifyNeonClient {
	return env.DATABASE_PROVIDER === "netlify-neon";
}

function createClient() {
	if (env.DATABASE_PROVIDER === "local") {
		if (!env.DATABASE_URL) {
			throw new Error("DATABASE_URL is required for local database");
		}

		return createLocalClient({
			connectionString: env.DATABASE_URL,
		});
	}

	return createNetlifyNeonClient();
}

function createDatabase(client: Client) {
	if (isLocalClient(client)) {
		return createLocalDatabase({ client });
	}

	if (isNetlifyNeonClient(client)) {
		return createNetlifyNeonDatabase({ client });
	}

	throw new Error("Invalid DATABASE_PROVIDER environment variable");
}

export const client = createClient();

export const db = createDatabase(client);
