export type Storage = {
	delete: (hash: string) => Promise<void>;
	get: (hash: string) => Promise<Blob>;
	has: (hash: string) => Promise<boolean>;
	set: (hash: string, blob: Blob) => Promise<void>;
};
