import type { Store } from "@netlify/blobs";

import type { Storage } from "./types.js";

type Options = {
	store: Store;
};

export function createNetlifyBlobsStorage({ store }: Options): Storage {
	async function get(hash: string) {
		return store.get(hash, { type: "blob" });
	}

	async function set(hash: string, blob: Blob) {
		await store.set(hash, blob);
	}

	async function _delete(hash: string) {
		await store.delete(hash);
	}

	async function has(hash: string) {
		const result = await store.get(hash);

		return !!result;
	}

	return {
		get,
		has,
		set,
		delete: _delete,
	};
}
