import fs from "node:fs";
import path from "node:path";

import { env } from "../env.js";

type Storage = {
	delete: (hash: string) => Promise<void>;
	get: (hash: string) => Promise<Blob>;
	has: (hash: string) => Promise<boolean>;
	set: (hash: string, blob: Blob) => Promise<void>;
};

type LocalStorageOptions = {
	basePath: string;
};

export function createLocalStorage({ basePath }: LocalStorageOptions): Storage {
	function initialize() {
		if (!fs.existsSync(basePath)) {
			fs.mkdirSync(basePath, { recursive: true });
		}
	}

	function getFilePath(hash: string) {
		return path.join(basePath, hash);
	}

	async function get(hash: string) {
		const buffer = await fs.promises.readFile(getFilePath(hash));

		return new Blob([buffer]);
	}

	async function set(hash: string, blob: Blob) {
		const buffer = await blob.arrayBuffer();

		return fs.promises.writeFile(getFilePath(hash), Buffer.from(buffer));
	}

	async function _delete(hash: string) {
		return fs.promises.unlink(getFilePath(hash));
	}

	async function has(hash: string) {
		try {
			await fs.promises.access(getFilePath(hash), fs.constants.F_OK);
			return true;
		} catch {
			return false;
		}
	}

	initialize();

	return {
		get,
		has,
		set,
		delete: _delete,
	};
}

export const storage = createLocalStorage({ basePath: env.LOCAL_STORAGE_PATH });
