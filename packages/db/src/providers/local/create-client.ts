import { Pool } from "pg";

type Options = {
	connectionString: string;
};

export function createClient(options: Options) {
	return new Pool(options);
}

export type Client = ReturnType<typeof createClient>;
