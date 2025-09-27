import type { Storage } from "@turborepo-remote-cache/storage";

import { getStore } from "@netlify/blobs";
import { createStorage as createLocalStorage } from "@turborepo-remote-cache/storage/local";
import { createStorage as createNetlifyBlobsStorage } from "@turborepo-remote-cache/storage/netlify-blobs";

import { env } from "../env.server";

function handleLocalStorage() {
	const basePath = env.LOCAL_STORAGE_PATH;

	if (!basePath) {
		throw new Error("LOCAL_STORAGE_PATH is not defined");
	}

	return createLocalStorage({ basePath });
}

function handleNetlifyBlobsStorage() {
	const name = env.NETLIFY_BLOBS_STORE_NAME;

	if (!name) {
		throw new Error("NETLIFY_BLOBS_STORE_NAME is not defined");
	}

	const store = getStore({
		name,
		siteID: env.NETLIFY_BLOBS_SITE_ID,
		token: env.NETLIFY_BLOBS_TOKEN,
	});

	return createNetlifyBlobsStorage({ store });
}

export function createStorage(): Storage {
	switch (env.STORAGE_PROVIDER) {
		case "local":
			return handleLocalStorage();
		case "netlify-blobs":
			return handleNetlifyBlobsStorage();
	}
}

export const storage = createStorage();
